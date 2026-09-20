import os
from typing import List

import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field


# ============================================================
# Configuration
# ============================================================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "lunara_pcos_model.joblib"
)


# ============================================================
# Load trained model
# ============================================================

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(
        f"Trained model not found at: {MODEL_PATH}"
    )

model = joblib.load(MODEL_PATH)

print("=" * 60)
print("LUNARA PCOS ML SERVICE")
print("=" * 60)
print("Model loaded successfully")
print("Model:", MODEL_PATH)


# ============================================================
# FastAPI
# ============================================================

app = FastAPI(
    title="Lunara PCOS Risk API",
    description="AI-powered PCOS wellness risk screening service",
    version="1.0.0",
)


# ============================================================
# Request Schema
# ============================================================

class PCOSRequest(BaseModel):
    age: float = Field(..., ge=10, le=100)

    heightCm: float = Field(..., gt=0)

    weightKg: float = Field(..., gt=0)

    avgCycleLength: float = Field(..., gt=0)

    avgPeriodLength: float = Field(..., gt=0)

    pcosFamilyHistory: bool = False

    knownConditions: List[str] = Field(default_factory=list)

    symptomsChecklist: List[str] = Field(default_factory=list)


# ============================================================
# Response Schemas
# ============================================================

class SHAPFeature(BaseModel):
    feature: str
    contribution: float
    direction: str


class PCOSResponse(BaseModel):
    riskLevel: str
    riskScore: float
    shap: List[SHAPFeature]


# ============================================================
# Helper Functions
# ============================================================

def calculate_bmi(weight_kg: float, height_cm: float) -> float:
    """
    Calculate BMI from weight and height.
    """

    height_m = height_cm / 100

    if height_m <= 0:
        raise ValueError("Height must be greater than zero")

    return weight_kg / (height_m ** 2)


def has_symptom(symptoms: List[str], *names: str) -> bool:
    """
    Case-insensitive symptom matching.
    """

    normalized = {
        str(symptom).strip().lower()
        for symptom in symptoms
    }

    return any(name.lower() in normalized for name in names)


def build_model_features(data: PCOSRequest) -> pd.DataFrame:
    """
    Convert Lunara API input into the exact 11 features
    used while training lunara_pcos_model.joblib.
    """

    bmi = calculate_bmi(
        data.weightKg,
        data.heightCm
    )

    # --------------------------------------------------------
    # Symptom mappings
    # --------------------------------------------------------

    irregular_periods = (
        data.avgCycleLength > 35
        or has_symptom(
            data.symptomsChecklist,
            "Irregular periods",
            "irregular_periods",
            "Irregular Periods"
        )
    )

    weight_gain = has_symptom(
        data.symptomsChecklist,
        "Weight changes",
        "Weight gain",
        "weightGain",
        "weight_gain"
    )

    hair_growth = has_symptom(
        data.symptomsChecklist,
        "Excess hair growth",
        "hair growth",
        "hairGrowth",
        "hair_growth"
    )

    skin_darkening = has_symptom(
        data.symptomsChecklist,
        "Skin darkening",
        "skinDarkening",
        "skin_darkening"
    )

    hair_loss = has_symptom(
        data.symptomsChecklist,
        "Hair thinning",
        "Hair loss",
        "hairLoss",
        "hair_loss"
    )

    pimples = has_symptom(
        data.symptomsChecklist,
        "Acne",
        "Pimples",
        "pimples"
    )

    # --------------------------------------------------------
    # IMPORTANT:
    # These column names MUST match train_app_model.py
    # --------------------------------------------------------

    features = {
        "age": data.age,
        "heightCm": data.heightCm,
        "weightKg": data.weightKg,
        "bmi": bmi,
        "avgCycleLength": data.avgCycleLength,
        "irregularPeriods": int(irregular_periods),
        "weightGain": int(weight_gain),
        "hairGrowth": int(hair_growth),
        "skinDarkening": int(skin_darkening),
        "hairLoss": int(hair_loss),
        "pimples": int(pimples),
    }

    return pd.DataFrame([features])


# ============================================================
# Risk Level
# ============================================================

def get_risk_level(probability: float) -> str:
    """
    Convert model probability into a user-friendly
    wellness risk category.
    """

    if probability < 0.35:
        return "Low"

    if probability < 0.65:
        return "Moderate"

    return "High"


# ============================================================
# Feature Explanation
# ============================================================

def generate_feature_explanations(
    features: pd.DataFrame,
    probability: float
) -> List[dict]:
    """
    Generate feature contribution information.

    The model is an XGBoost classifier. We use the model's
    feature importance together with the user's feature values
    to create interpretable contribution indicators.

    These are explanation indicators, not a medical diagnosis.
    """

    try:
        xgb_model = model.named_steps["xgb"]

        importances = xgb_model.feature_importances_

        feature_names = features.columns.tolist()

        explanations = []

        for feature_name, importance, value in zip(
            feature_names,
            importances,
            features.iloc[0].values
        ):

            importance = float(importance)

            if importance <= 0:
                continue

            # Determine whether this feature is active/present.
            if isinstance(value, (int, float)):
                active = value > 0
            else:
                active = bool(value)

            # For binary symptom features:
            # active feature -> positive contribution.
            #
            # For continuous features, use the feature
            # importance as an indication of relevance.
            contribution = importance * 100

            if active:
                direction = "positive"
            else:
                direction = "neutral"

            explanations.append(
                {
                    "feature": feature_name,
                    "contribution": round(contribution, 4),
                    "direction": direction,
                }
            )

        # Highest-impact features first
        explanations.sort(
            key=lambda x: abs(x["contribution"]),
            reverse=True
        )

        return explanations[:10]

    except Exception as error:
        print(
            "Feature explanation error:",
            error
        )

        return []


# ============================================================
# Routes
# ============================================================

@app.get("/")
def root():
    return {
        "service": "Lunara PCOS Risk API",
        "status": "running",
        "model": "lunara_pcos_model.joblib",
        "model_loaded": True,
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "Lunara PCOS Risk API",
        "model_loaded": True,
    }


# ============================================================
# Prediction Endpoint
# ============================================================

@app.post(
    "/predict",
    response_model=PCOSResponse
)
def predict_pcos(data: PCOSRequest):

    try:

        # ----------------------------------------------------
        # Build the exact 11-feature input expected by model
        # ----------------------------------------------------

        features = build_model_features(data)

        print("\nIncoming prediction request:")
        print(features.to_string(index=False))

        # ----------------------------------------------------
        # Get probability from trained XGBoost model
        # ----------------------------------------------------

        probabilities = model.predict_proba(features)

        # Probability of PCOS = class 1
        risk_probability = float(probabilities[0][1])

        # Convert to percentage
        risk_score = round(
            risk_probability * 100,
            2
        )

        # ----------------------------------------------------
        # Risk category
        # ----------------------------------------------------

        risk_level = get_risk_level(
            risk_probability
        )

        # ----------------------------------------------------
        # Feature explanations
        # ----------------------------------------------------

        shap_features = generate_feature_explanations(
            features,
            risk_probability
        )

        print("\nPrediction:")
        print("Risk probability:", risk_probability)
        print("Risk score:", risk_score)
        print("Risk level:", risk_level)

        # ----------------------------------------------------
        # Return result
        # ----------------------------------------------------

        return {
            "riskLevel": risk_level,
            "riskScore": risk_score,
            "shap": shap_features,
        }

    except Exception as error:

        print(
            "\nPrediction error:",
            repr(error)
        )

        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(error)}"
        )