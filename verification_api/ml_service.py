import json
from pathlib import Path

import numpy as np
import pandas as pd
from xgboost import XGBClassifier


# ---------------------------------
# File locations
# ---------------------------------

BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "ml_models"

MODEL_PATH = MODEL_DIR / "xgb_final.json"
CONFIG_PATH = MODEL_DIR / "model_config.json"
PREPROCESSOR_PATH = MODEL_DIR / "preprocessor_portable.json"


# ---------------------------------
# Load configuration
# ---------------------------------

with open(CONFIG_PATH, "r") as f:
    config = json.load(f)

with open(PREPROCESSOR_PATH, "r") as f:
    preprocessing = json.load(f)


# ---------------------------------
# Load XGBoost model
# ---------------------------------

model = XGBClassifier()
model.load_model(MODEL_PATH)

THRESHOLD = float(config["threshold"])

categorical_features = preprocessing["categorical_features"]
numeric_features = preprocessing["numeric_features"]

categories = preprocessing["categories"]
numeric_medians = np.array(
    preprocessing["numeric_medians"],
    dtype=float
)

scaler_mean = np.array(
    preprocessing["scaler_mean"],
    dtype=float
)

scaler_scale = np.array(
    preprocessing["scaler_scale"],
    dtype=float
)


# ---------------------------------
# Portable preprocessing
# ---------------------------------

def preprocess_input(data):

    # Categorical features
    categorical_values = []

    for feature in categorical_features:
        value = data.get(feature)

        if value is None or pd.isna(value):
            value = "Unknown"

        categorical_values.append(str(value))

    encoded_categorical = []

    for value, known_categories in zip(
        categorical_values,
        categories
    ):
        row = [0.0] * len(known_categories)

        try:
            index = known_categories.index(value)
            row[index] = 1.0
        except ValueError:
            # Same behavior as handle_unknown="ignore"
            pass

        encoded_categorical.extend(row)

    # Numerical features
    numerical_values = []

    for i, feature in enumerate(numeric_features):

        value = data.get(feature)

        try:
            if value is None or pd.isna(value):
                value = numeric_medians[i]
            else:
                value = float(value)
        except (ValueError, TypeError):
            value = numeric_medians[i]

        numerical_values.append(value)

    numerical_values = np.array(
        numerical_values,
        dtype=float
    )

    # Same transformation as StandardScaler
    scaled_numerical = (
        numerical_values - scaler_mean
    ) / scaler_scale

    final_input = np.array(
        encoded_categorical +
        scaled_numerical.tolist(),
        dtype=np.float32
    ).reshape(1, -1)

    return final_input


# ---------------------------------
# Behavioral risk prediction
# ---------------------------------

def predict_behavioral_risk(input_data):

    required_fields = [
        "Country",
        "Region",
        "City",
        "ASN",
        "Browser Name and Version",
        "OS Name and Version",
        "Device Type",
        "Login Successful",
        "Is Attack IP",
        "Login Timestamp"
    ]

    missing = [
        field
        for field in required_fields
        if field not in input_data
    ]

    if missing:
        raise ValueError(
            "Missing behavioral fields: "
            + ", ".join(missing)
        )

    # ---------------------------------
    # Time feature engineering
    # ---------------------------------

    timestamp = pd.to_datetime(
        input_data["Login Timestamp"],
        errors="coerce"
    )

    if pd.isna(timestamp):
        raise ValueError("Invalid Login Timestamp")

    prepared = dict(input_data)

    prepared["Login Hour"] = timestamp.hour
    prepared["Login Day"] = timestamp.dayofweek

    prepared["Login Is Weekend"] = int(
        timestamp.dayofweek >= 5
    )

    # ---------------------------------
    # Preprocess
    # ---------------------------------

    model_input = preprocess_input(prepared)

    expected_features = int(
        config["encoded_features"]
    )

    if model_input.shape[1] != expected_features:
        raise ValueError(
            f"Feature count mismatch: "
            f"{model_input.shape[1]} != "
            f"{expected_features}"
        )

    # ---------------------------------
    # Prediction
    # ---------------------------------

    probability = float(
        model.predict_proba(model_input)[0][1]
    )

    high_risk = probability >= THRESHOLD

    return {
        "behavioral_risk_score": round(
            probability,
            6
        ),
        "threshold": THRESHOLD,
        "high_risk": bool(high_risk),
        "ml_target": "Is Account Takeover"
    }