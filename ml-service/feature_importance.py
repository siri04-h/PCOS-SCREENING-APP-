import pandas as pd
import matplotlib.pyplot as plt

from xgboost import XGBClassifier


DATA_FILE = "data/pcos_clean.csv"
TARGET = "PCOS (Y/N)"


# Load data
df = pd.read_csv(DATA_FILE)

X = df.drop(columns=[TARGET])
y = df[TARGET]


# Train XGBoost using the validated configuration
model = XGBClassifier(
    n_estimators=300,
    max_depth=4,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    objective="binary:logistic",
    eval_metric="logloss",
    random_state=42,
    n_jobs=-1,
)

model.fit(X, y)


# Feature importance
importance = pd.DataFrame({
    "Feature": X.columns,
    "Importance": model.feature_importances_,
})

importance = importance.sort_values(
    by="Importance",
    ascending=False,
)


print("\nTop 20 Features:")
print(importance.head(20).to_string(index=False))


# Save feature importance
importance.to_csv(
    "models/feature_importance.csv",
    index=False,
)


# Plot top 15
top = importance.head(15).sort_values("Importance")

plt.figure(figsize=(10, 7))
plt.barh(top["Feature"], top["Importance"])
plt.xlabel("Importance")
plt.ylabel("Feature")
plt.title("PCOS Model - Top 15 Feature Importance")
plt.tight_layout()

plt.savefig(
    "models/feature_importance.png",
    dpi=150,
)

plt.close()

print("\nSaved:")
print("models/feature_importance.csv")
print("models/feature_importance.png")