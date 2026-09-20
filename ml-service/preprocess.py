import pandas as pd

INPUT_FILE = "data/PCOS_data_without_infertility.xlsx"
OUTPUT_FILE = "data/pcos_clean.csv"

# Load actual patient data
df = pd.read_excel(INPUT_FILE, sheet_name="Full_new")

print("Original shape:", df.shape)

# Remove unnecessary columns
df = df.drop(columns=[
    "Sl. No",
    "Patient File No.",
    "Unnamed: 44"
])

# Fix numeric columns containing malformed text
df["II    beta-HCG(mIU/mL)"] = pd.to_numeric(
    df["II    beta-HCG(mIU/mL)"].astype(str).str.rstrip("."),
    errors="coerce"
)

df["AMH(ng/mL)"] = pd.to_numeric(
    df["AMH(ng/mL)"],
    errors="coerce"
)

# Fill missing numerical values using the median
numeric_columns = df.select_dtypes(include=["number"]).columns

for column in numeric_columns:
    if column != "PCOS (Y/N)":
        df[column] = df[column].fillna(df[column].median())

# Separate target
target = "PCOS (Y/N)"

# Save cleaned dataset
df.to_csv(OUTPUT_FILE, index=False)

print("Cleaned shape:", df.shape)
print("Remaining missing values:", df.isnull().sum().sum())
print("Saved to:", OUTPUT_FILE)
print("\nTarget distribution:")
print(df[target].value_counts())