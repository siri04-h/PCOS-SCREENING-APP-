import pandas as pd

from sklearn.model_selection import StratifiedKFold, cross_validate
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from xgboost import XGBClassifier


# --------------------------------------------------
# Configuration
# --------------------------------------------------

DATA_FILE = "data/pcos_clean.csv"
TARGET = "PCOS (Y/N)"
RANDOM_STATE = 42


# --------------------------------------------------
# Load dataset
# --------------------------------------------------

df = pd.read_csv(DATA_FILE)

X = df.drop(columns=[TARGET])
y = df[TARGET]

print("Dataset shape:", df.shape)
print("Features:", X.shape[1])
print("Target distribution:")
print(y.value_counts())


# --------------------------------------------------
# XGBoost pipeline
# --------------------------------------------------

model = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("xgb", XGBClassifier(
        n_estimators=300,
        max_depth=4,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        objective="binary:logistic",
        eval_metric="logloss",
        random_state=RANDOM_STATE,
        n_jobs=-1,
    )),
])


# --------------------------------------------------
# Stratified 5-fold cross-validation
# --------------------------------------------------

cv = StratifiedKFold(
    n_splits=5,
    shuffle=True,
    random_state=RANDOM_STATE,
)


scoring = {
    "accuracy": "accuracy",
    "precision": "precision",
    "recall": "recall",
    "f1": "f1",
    "roc_auc": "roc_auc",
}


print("\nRunning 5-fold stratified cross-validation...")
print("-" * 60)


scores = cross_validate(
    model,
    X,
    y,
    cv=cv,
    scoring=scoring,
    n_jobs=-1,
)


# --------------------------------------------------
# Display fold results
# --------------------------------------------------

for metric in scoring:
    values = scores[f"test_{metric}"]

    print(
        f"{metric.upper():10} | "
        f"Mean: {values.mean():.4f} | "
        f"Std: {values.std():.4f}"
    )


# --------------------------------------------------
# Detailed fold scores
# --------------------------------------------------

print("\nIndividual fold scores:")

for metric in scoring:
    values = scores[f"test_{metric}"]

    print(f"\n{metric.upper()}:")
    for i, value in enumerate(values, start=1):
        print(f"  Fold {i}: {value:.4f}")