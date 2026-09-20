import os
import joblib
import pandas as pd

from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from xgboost import XGBClassifier


DATA_FILE = "data/pcos_clean.csv"
MODEL_DIR = "models"
MODEL_FILE = os.path.join(MODEL_DIR, "pcos_model.joblib")

TARGET = "PCOS (Y/N)"


# Load complete cleaned dataset
df = pd.read_csv(DATA_FILE)

X = df.drop(columns=[TARGET])
y = df[TARGET]

print("Training final model")
print("--------------------")
print("Dataset shape:", df.shape)
print("Features:", X.shape[1])
print("Patients:", len(df))

print("\nTarget distribution:")
print(y.value_counts())


# Use the configuration that performed best
# during our original validation.
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
            random_state=42,
            n_jobs=-1,
        ),
    ),
])


# Train on the complete dataset
model.fit(X, y)


# Create models directory if necessary
os.makedirs(MODEL_DIR, exist_ok=True)


# Save final model
joblib.dump(model, MODEL_FILE)


print("\nFinal model trained successfully.")
print("Saved to:", MODEL_FILE)