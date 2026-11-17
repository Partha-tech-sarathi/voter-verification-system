import pandas as pd


# 1. LOAD PREPROCESSED DATA
df = pd.read_csv(
    "behavioral_risk/rba_preprocessed.csv"
)

print("Original shape:", df.shape)


# 2. ATTACK + FAILED LOGIN INTERACTION
df["Attack Failed Login"] = (
    df["Is Attack IP"].astype(int)
    *
    (1 - df["Login Successful"].astype(int))
)


# 3. ATTACK + WEEKEND INTERACTION
df["Attack Weekend"] = (
    df["Is Attack IP"].astype(int)
    *
    df["Login Is Weekend"].astype(int)
)


# 4. NIGHT LOGIN
df["Night Login"] = (
    (df["Login Hour"] < 6)
    |
    (df["Login Hour"] >= 22)
).astype(int)


# 5. ATTACK + NIGHT LOGIN
df["Attack Night Login"] = (
    df["Is Attack IP"].astype(int)
    *
    df["Night Login"]
)


# 6. FAILED + NIGHT LOGIN
df["Failed Night Login"] = (
    (1 - df["Login Successful"].astype(int))
    *
    df["Night Login"]
)


# 7. SAVE NEW DATASET
output_path = (
    "behavioral_risk/"
    "rba_feature_engineered.csv"
)

df.to_csv(
    output_path,
    index=False
)


print("New shape:", df.shape)

print("\nNew features:")
print("Attack Failed Login")
print("Attack Weekend")
print("Night Login")
print("Attack Night Login")
print("Failed Night Login")

print("\nSaved:")
print(output_path)