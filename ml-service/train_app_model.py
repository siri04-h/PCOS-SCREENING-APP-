import os
import joblib
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from xgboost import XGBClassifier

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    classification_report,
    confusion_matrix,
)


DATA_FILE = "data/pcos_clean.csv"
MODEL_DIR = "models"
MODEL_FILE = os.path.join(MODEL_DIR, "lunara_pcos_model.joblib")

TARGET = "PCOS (Y/N)"
RANDOM_STATE = 42


# --------------------------------------------------
# Load dataset
# --------------------------------------------------

df = pd.read_csv(DATA_FILE)

print("Dataset shape:", df.shape)


# --------------------------------------------------
# Create only features available to Lunara
# --------------------------------------------------

features = pd.DataFrame()

features["age"] = df[" Age (yrs)"]
features["heightCm"] = df["Height(Cm) "]
features["weightKg"] = df["Weight (Kg)"]

# BMI is already available in the dataset
features["bmi"] = df["BMI"]

features["avgCycleLength"] = df["Cycle length(days)"]

# Cycle(R/I):
# Dataset uses 2 = regular and 4 = irregular
features["irregularPeriods"] = (
    df["Cycle(R/I)"] == 4
).astype(int)

# Symptoms available in the Lunara health profile
features["weightGain"] = df["Weight gain(Y/N)"]
features["hairGrowth"] = df["hair growth(Y/N)"]
features["skinDarkening"] = df["Skin darkening (Y/N)"]
features["hairLoss"] = df["Hair loss(Y/N)"]
features["pimples"] = df["Pimples(Y/N)"]


y = df[TARGET]


print("\nLunara-compatible features:")
print(features.columns.tolist())

print("\nFeature shape:", features.shape)

print("\nTarget distribution:")
print(y.value_counts())


# --------------------------------------------------
# Train/test split
# --------------------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    features,
    y,
    test_size=0.20,
    random_state=RANDOM_STATE,
    stratify=y,
)


print("\nTraining samples:", len(X_train))
print("Testing samples:", len(X_test))


# --------------------------------------------------
# XGBoost model
# --------------------------------------------------

model = Pipeline([
    (
        "imputer",
        SimpleImputer(strategy="median")
    ),
    (
        "xgb",
        XGBClassifier(
            n_estimators=300,
            max_depth=4,
            learning_rate=0.05,
            subsample=0.8,
            colsample_bytree=0.8,
            objective="binary:logistic",
            eval_metric="logloss",
            random_state=RANDOM_STATE,
            n_jobs=-1,
        ),
    ),
])


# --------------------------------------------------
# Train
# --------------------------------------------------

print("\nTraining Lunara-compatible XGBoost model...")

model.fit(X_train, y_train)


# --------------------------------------------------
# Evaluate
# --------------------------------------------------

y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]


accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred, zero_division=0)
recall = recall_score(y_test, y_pred, zero_division=0)
f1 = f1_score(y_test, y_pred, zero_division=0)
roc_auc = roc_auc_score(y_test, y_prob)


print("\n" + "=" * 60)
print("LUNARA MODEL RESULTS")
print("=" * 60)

print(f"Accuracy : {accuracy:.4f}")
print(f"Precision: {precision:.4f}")
print(f"Recall   : {recall:.4f}")
print(f"F1 Score : {f1:.4f}")
print(f"ROC-AUC  : {roc_auc:.4f}")


print("\nClassification Report:")

print(
    classification_report(
        y_test,
        y_pred,
        target_names=["No PCOS", "PCOS"],
        zero_division=0,
    )
)


print("Confusion Matrix:")

print(confusion_matrix(y_test, y_pred))


# --------------------------------------------------
# Train final model on complete dataset
# --------------------------------------------------

print("\nTraining final model on complete dataset...")

model.fit(features, y)


# --------------------------------------------------
# Save
# --------------------------------------------------

os.makedirs(MODEL_DIR, exist_ok=True)

joblib.dump(model, MODEL_FILE)

print("\nFinal Lunara model saved to:")
print(MODEL_FILE)

print("\nExpected API features:")
print(features.columns.tolist())