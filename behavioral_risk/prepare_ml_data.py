import pandas as pd
from sklearn.model_selection import train_test_split

data_path = "behavioral_risk/rba_preprocessed.csv"

df = pd.read_csv(data_path)

print("Loaded shape:", df.shape)

# Target
y = df["Is Account Takeover"].astype(int)

# Features
X = df.drop(columns=["Is Account Takeover"])

# Stratified 80/20 split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("\nTRAIN SET")
print("X_train shape:", X_train.shape)
print("y_train distribution:")
print(y_train.value_counts())

print("\nTEST SET")
print("X_test shape:", X_test.shape)
print("y_test distribution:")
print(y_test.value_counts())