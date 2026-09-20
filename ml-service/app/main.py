
import os
from typing import List

import joblib
import pandas as pd
import shap

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from app.emotion_fusion import fuse_emotions
from app.text_emotion import predict_text_emotion
from app.voice_emotion import predict_voice_emotion
from app.face_emotion import predict_face_emotion
from app.recommendation_engine import generate_recommendations
from app.pattern_analysis import analyze_pattern
from app.baseline import calculate_baseline
from app.patterns import detect_patterns
from app.alerts import detect_alerts


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

    knownConditions: List[str] = Field(
        default_factory=list
    )

    symptomsChecklist: List[str] = Field(
        default_factory=list
    )


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

class TextEmotionRequest(BaseModel):
    text: str = Field(..., min_length=1)

class TextEmotionResponse(BaseModel):
    emotion: str
    confidence: float

class VoiceEmotionRequest(BaseModel):
    audioPath: str

class VoiceEmotionResponse(BaseModel):
    emotion: str
    confidence: float

class FaceEmotionRequest(BaseModel):
    imagePath: str

class FaceEmotionResponse(BaseModel):
    emotion: str
    confidence: float

class EmotionFusionRequest(BaseModel):
    textEmotion: str
    voiceEmotion: str
    faceEmotion: str
    selfReport: str

class EmotionFusionResponse(BaseModel):
    overallEmotion: str
    confidence: float
    sources: dict

class DailyLog(BaseModel):
    date: str | None = None
    sleepHours: float | None = None
    waterIntakeMl: float | None = None
    activityMinutes: float | None = None
    energyLevel: float | None = None
    stressLevel: float | None = None


class RecommendationRequest(BaseModel):
    sleepHours: float | None = None
    waterIntakeMl: float | None = None
    activityMinutes: float | None = None
    energyLevel: float | None = None
    stressLevel: float | None = None

    baseline: dict | None = None
    patterns: list[dict] = Field(default_factory=list)


class RecommendationItem(BaseModel):
    title: str
    message: str
    basedOn: str


class RecommendationResponse(BaseModel):
    recommendations: List[RecommendationItem]

class PatternRequest(BaseModel):
    currentSleep: float | None = None
    usualSleep: float | None = None

    currentStress: float | None = None
    usualStress: float | None = None

    currentEnergy: float | None = None
    usualEnergy: float | None = None

    currentActivity: float | None = None
    usualActivity: float | None = None


class PatternResponse(BaseModel):
    insights: list[dict]


# ============================================================
# Helper Functions
# ============================================================

def calculate_bmi(
    weight_kg: float,
    height_cm: float
) -> float:
    """
    Calculate BMI from weight and height.
    """

    height_m = height_cm / 100

    if height_m <= 0:
        raise ValueError(
            "Height must be greater than zero"
        )

    return weight_kg / (height_m ** 2)


def has_symptom(
    symptoms: List[str],
    *names: str
) -> bool:
    """
    Case-insensitive symptom matching.
    """

    normalized = {
        str(symptom).strip().lower()
        for symptom in symptoms
    }

    return any(
        name.lower() in normalized
        for name in names
    )


def build_model_features(
    data: PCOSRequest
) -> pd.DataFrame:
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
    # These column names and order MUST match
    # train_app_model.py
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

def get_risk_level(
    probability: float
) -> str:
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
# Feature Explanation using SHAP
# ============================================================

def generate_feature_explanations(
    features: pd.DataFrame,
    probability: float
) -> List[dict]:
    """
    Generate real per-user SHAP explanations
    for the XGBoost model.

    Positive SHAP values indicate that the feature
    pushed the prediction toward PCOS.

    Negative SHAP values indicate that the feature
    pushed the prediction away from PCOS.

    These explanations are for model interpretability
    and are not a medical diagnosis.
    """

    try:
        # ----------------------------------------------------
        # Get the preprocessing and XGBoost steps
        # ----------------------------------------------------

        imputer = model.named_steps["imputer"]
        xgb_model = model.named_steps["xgb"]

        # ----------------------------------------------------
        # Apply the exact same preprocessing used during
        # model training.
        # ----------------------------------------------------

        transformed_features = imputer.transform(
            features
        )

        # ----------------------------------------------------
        # Feature names used during training
        # ----------------------------------------------------

        feature_names = [
            "age",
            "heightCm",
            "weightKg",
            "bmi",
            "avgCycleLength",
            "irregularPeriods",
            "weightGain",
            "hairGrowth",
            "skinDarkening",
            "hairLoss",
            "pimples",
        ]

        # ----------------------------------------------------
        # Create SHAP TreeExplainer
        # ----------------------------------------------------

        explainer = shap.TreeExplainer(
            xgb_model
        )

        # ----------------------------------------------------
        # Calculate SHAP values for this user
        # ----------------------------------------------------

        shap_values = explainer.shap_values(
            transformed_features
        )

        # ----------------------------------------------------
        # Handle different SHAP output formats
        # ----------------------------------------------------

        if isinstance(shap_values, list):
            values = shap_values[0]
        else:
            values = shap_values

        # First row = current user
        values = values[0]

        # ----------------------------------------------------
        # Build explanation objects
        # ----------------------------------------------------

        explanations = []

        for feature_name, shap_value in zip(
            feature_names,
            values
        ):

            shap_value = float(shap_value)

            # ------------------------------------------------
            # Determine contribution direction
            # ------------------------------------------------

            if shap_value > 0:
                direction = "positive"

            elif shap_value < 0:
                direction = "negative"

            else:
                direction = "neutral"

            explanations.append(
                {
                    "feature": feature_name,
                    "contribution": round(
                        shap_value,
                        4
                    ),
                    "direction": direction,
                }
            )

        # ----------------------------------------------------
        # Highest absolute contribution first
        # ----------------------------------------------------

        explanations.sort(
            key=lambda x: abs(
                x["contribution"]
            ),
            reverse=True
        )

        # Return the top 10 explanations
        return explanations[:10]

    except Exception as error:

        print(
            "SHAP explanation error:",
            repr(error)
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
def predict_pcos(
    data: PCOSRequest
):

    try:

        # ----------------------------------------------------
        # Build the exact 11-feature input expected by model
        # ----------------------------------------------------

        features = build_model_features(
            data
        )

        print(
            "\nIncoming prediction request:"
        )

        print(
            features.to_string(
                index=False
            )
        )

        # ----------------------------------------------------
        # Get probability from trained XGBoost model
        # ----------------------------------------------------

        probabilities = model.predict_proba(
            features
        )

        # Probability of PCOS = class 1
        risk_probability = float(
            probabilities[0][1]
        )

        # ----------------------------------------------------
        # Convert probability to percentage
        # ----------------------------------------------------

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
        # Generate actual SHAP explanations
        # ----------------------------------------------------

        shap_features = (
            generate_feature_explanations(
                features,
                risk_probability
            )
        )

        # ----------------------------------------------------
        # Logging
        # ----------------------------------------------------

        print("\nPrediction:")
        print(
            "Risk probability:",
            risk_probability
        )

        print(
            "Risk score:",
            risk_score
        )

        print(
            "Risk level:",
            risk_level
        )

        print(
            "SHAP explanations:",
            shap_features
        )

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

@app.post("/emotion/text", response_model=TextEmotionResponse)
def detect_text_emotion(request: TextEmotionRequest):
    """
    Detect emotion from user-entered text.
    """
    result = predict_text_emotion(request.text)

    return TextEmotionResponse(
        emotion=result["emotion"],
        confidence=result["confidence"]
    )
@app.post("/emotion/voice", response_model=VoiceEmotionResponse)
def detect_voice_emotion(request: VoiceEmotionRequest):
    result = predict_voice_emotion(request.audioPath)
    return VoiceEmotionResponse(**result)

@app.post("/emotion/face", response_model=FaceEmotionResponse)
def detect_face_emotion(request: FaceEmotionRequest):
    result = predict_face_emotion(request.imagePath)
    return FaceEmotionResponse(**result)

@app.post("/emotion/fusion", response_model=EmotionFusionResponse)
def detect_overall_emotion(request: EmotionFusionRequest):
    result = fuse_emotions(
        request.textEmotion,
        request.voiceEmotion,
        request.faceEmotion,
        request.selfReport
    )

    return EmotionFusionResponse(**result)

@app.post("/recommendations", response_model=RecommendationResponse)
def get_recommendations(request: RecommendationRequest):

    data = request.model_dump()

    recs = generate_recommendations(data)

    return RecommendationResponse(
        recommendations=recs
    )

@app.post("/pattern-analysis", response_model=PatternResponse)
def pattern_analysis(request: PatternRequest):

    result = analyze_pattern(request.model_dump())

    return PatternResponse(
        insights=result["insights"]
    )

# ============================================================
# Personal Baseline
# ============================================================

@app.post("/baseline")
def get_baseline(request: dict):

    daily_logs = request.get("dailyLogs", [])

    baseline = calculate_baseline(daily_logs)

    return {
        "baseline": baseline
    }


# ============================================================
# Recurring Patterns
# ============================================================

@app.post("/patterns")
def get_patterns(request: dict):

    daily_logs = request.get("dailyLogs", [])
    symptoms = request.get("symptoms", [])
    cycles = request.get("cycles", [])

    patterns = detect_patterns(
        daily_logs=daily_logs,
        symptoms=symptoms,
        cycles=cycles,
    )

    return {
        "patterns": patterns
    }


# ============================================================
#  Wellness Alerts
# ============================================================

@app.post("/alerts")
def get_alerts(request: dict):

    daily_logs = request.get("dailyLogs", [])

    baseline = calculate_baseline(daily_logs)

    alerts = detect_alerts(
        daily_logs=daily_logs,
        baseline=baseline,
    )

    return {
        "alerts": alerts
    }


# ============================================================
# Complete Analysis
# ============================================================

@app.post("/analyze")
def analyze_wellness(request: dict):

    daily_logs = request.get("dailyLogs", [])
    symptoms = request.get("symptoms", [])
    cycles = request.get("cycles", [])

    baseline = calculate_baseline(daily_logs)

    patterns = detect_patterns(
        daily_logs=daily_logs,
        symptoms=symptoms,
        cycles=cycles,
    )

    alerts = detect_alerts(
        daily_logs=daily_logs,
        baseline=baseline,
    )

    recommendations = generate_recommendations({
        "sleepHours": daily_logs[-1].get("sleepHours") if daily_logs else None,
        "waterIntakeMl": daily_logs[-1].get("waterIntakeMl") if daily_logs else None,
        "activityMinutes": daily_logs[-1].get("activityMinutes") if daily_logs else None,
        "energyLevel": daily_logs[-1].get("energyLevel") if daily_logs else None,
        "stressLevel": daily_logs[-1].get("stressLevel") if daily_logs else None,
        "baseline": baseline,
        "patterns": patterns,
    })

    return {
        "baseline": baseline,
        "patterns": patterns,
        "recommendations": recommendations,
        "alerts": alerts,
    }