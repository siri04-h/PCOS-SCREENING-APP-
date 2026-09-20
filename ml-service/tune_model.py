import pandas as pd

from sklearn.model_selection import StratifiedKFold, RandomizedSearchCV
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from xgboost import XGBClassifier


DATA_FILE = "data/pcos_clean.csv"
TARGET = "PCOS (Y/N)"
RANDOM_STATE = 42


# --------------------------------------------------
# Load data
# --------------------------------------------------

df = pd.read_csv(DATA_FILE)

X = df.drop(columns=[TARGET])
y = df[TARGET]

print("Dataset:", X.shape)
print("Target distribution:")
print(y.value_counts())


# --------------------------------------------------
# Pipeline
# --------------------------------------------------

pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("xgb", XGBClassifier(
        objective="binary:logistic",
        eval_metric="logloss",
        random_state=RANDOM_STATE,
        n_jobs=-1,
    )),
])


# --------------------------------------------------
# Parameter search
# --------------------------------------------------

param_distributions = {
    "xgb__n_estimators": [100, 200, 300, 400],
    "xgb__max_depth": [2, 3, 4, 5, 6],
    "xgb__learning_rate": [0.01, 0.03, 0.05, 0.1],
    "xgb__subsample": [0.7, 0.8, 0.9, 1.0],
    "xgb__colsample_bytree": [0.7, 0.8, 0.9, 1.0],
    "xgb__min_child_weight": [1, 3, 5],
    "xgb__gamma": [0, 0.1, 0.3],
}


# --------------------------------------------------
# Cross-validation
# --------------------------------------------------

cv = StratifiedKFold(
    n_splits=5,
    shuffle=True,
    random_state=RANDOM_STATE,
)


# --------------------------------------------------
# Randomized search
# --------------------------------------------------

search = RandomizedSearchCV(
    estimator=pipeline,
    param_distributions=param_distributions,
    n_iter=30,
    scoring="f1",
    cv=cv,
    random_state=RANDOM_STATE,
    n_jobs=-1,
    verbose=1,
    return_train_score=False,
)


print("\nStarting hyperparameter search...")
print("This may take a few minutes.")


search.fit(X, y)


# --------------------------------------------------
# Results
# --------------------------------------------------

print("\n" + "=" * 60)
print("BEST MODEL")
print("=" * 60)

print("\nBest F1 score:")
print(f"{search.best_score_:.4f}")

print("\nBest parameters:")

for parameter, value in search.best_params_.items():
    print(f"{parameter}: {value}")


# --------------------------------------------------
# Top configurations
# --------------------------------------------------

results = pd.DataFrame(search.cv_results_)

top_results = results[
    [
        "mean_test_score",
        "std_test_score",
        "params",
    ]
].sort_values(
    by="mean_test_score",
    ascending=False,
).head(10)


print("\nTop 10 configurations:")
print(top_results.to_string(index=False))