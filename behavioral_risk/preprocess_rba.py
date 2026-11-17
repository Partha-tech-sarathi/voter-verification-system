import pandas as pd

sample_path = "behavioral_risk/rba_ml_sample.csv"
output_path = "behavioral_risk/rba_preprocessed.csv"

df = pd.read_csv(sample_path)

print("Original shape:", df.shape)

# Convert timestamp
df["Login Timestamp"] = pd.to_datetime(
    df["Login Timestamp"],
    errors="coerce"
)

# Create time-based features
df["Login Hour"] = df["Login Timestamp"].dt.hour
df["Login Day"] = df["Login Timestamp"].dt.dayofweek
df["Login Is Weekend"] = (
    df["Login Day"] >= 5
).astype(int)

# Remove unsuitable/high-cardinality columns
columns_to_drop = [
    "index",
    "Login Timestamp",
    "User ID",
    "IP Address",
    "User Agent String",
    "Round-Trip Time [ms]"
]

df = df.drop(columns=columns_to_drop)

# Fill small number of missing categorical values
categorical_columns = [
    "Country",
    "Region",
    "City",
    "Browser Name and Version",
    "OS Name and Version",
    "Device Type"
]

for column in categorical_columns:
    df[column] = df[column].fillna("Unknown")

print("\nPreprocessed shape:", df.shape)

print("\nRemaining columns:")
print(df.columns.tolist())

print("\nMissing values:")
print(df.isnull().sum())

print("\nTarget distribution:")
print(df["Is Account Takeover"].value_counts())

df.to_csv(output_path, index=False)

print("\nSaved:")
print(output_path)