import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    matthews_corrcoef,
    confusion_matrix,
    roc_auc_score,
    roc_curve
)

from xgboost import XGBClassifier
from catboost import CatBoostClassifier


# ================================
# 1. LOAD FEATURE-ENGINEERED DATA
# ================================

df = pd.read_csv(
    "behavioral_risk/rba_feature_engineered.csv"
)

y = df["Is Account Takeover"].astype(int)
X = df.drop(columns=["Is Account Takeover"])

print("Dataset shape:", df.shape)


# ================================
# 2. SAME TRAIN / TEST SPLIT
# ================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("Training samples:", len(X_train))
print("Testing samples :", len(X_test))


# ================================
# 3. COLUMNS
# ================================

categorical_columns = [
    "Country",
    "Region",
    "City",
    "Browser Name and Version",
    "OS Name and Version",
    "Device Type"
]

numerical_columns = [
    "ASN",
    "Login Hour",
    "Login Day",
    "Login Is Weekend",
    "Login Successful",
    "Is Attack IP",

    # NEW FEATURES
    "Attack Failed Login",
    "Attack Weekend",
    "Night Login",
    "Attack Night Login",
    "Failed Night Login"
]


# ================================
# 4. PREPROCESSING
# ================================

preprocessor = ColumnTransformer(
    transformers=[
        (
            "cat",
            OneHotEncoder(
                handle_unknown="ignore",
                sparse_output=False
            ),
            categorical_columns
        ),
        (
            "num",
            StandardScaler(),
            numerical_columns
        )
    ]
)

print("\nPreprocessing...")

X_train_p = preprocessor.fit_transform(X_train)
X_test_p = preprocessor.transform(X_test)

print("Preprocessing completed.")


# ================================
# 5. GRADIENT BOOSTING
# ================================

print("\nTraining Gradient Boosting...")

gb = GradientBoostingClassifier(
    learning_rate=0.1,
    n_estimators=100,
    max_depth=3,
    random_state=42
)

gb.fit(X_train_p, y_train)

gb_prob = gb.predict_proba(
    X_test_p
)[:, 1]

print("Gradient Boosting completed.")


# ================================
# 6. XGBOOST
# ================================

print("\nTraining XGBoost...")

xgb = XGBClassifier(
    learning_rate=0.1,
    n_estimators=100,
    max_depth=6,
    eval_metric="logloss",
    tree_method="hist",
    random_state=42
)

xgb.fit(X_train_p, y_train)

xgb_prob = xgb.predict_proba(
    X_test_p
)[:, 1]

print("XGBoost completed.")


# ================================
# 7. CATBOOST GPU
# ================================

print("\nTraining CatBoost GPU...")

cat = CatBoostClassifier(
    iterations=100,
    learning_rate=0.1,
    depth=6,
    task_type="GPU",
    devices="0",
    verbose=False,
    random_seed=42
)

cat.fit(X_train_p, y_train)

cat_prob = cat.predict_proba(
    X_test_p
)[:, 1]

print("CatBoost completed.")


# ================================
# 8. SOFT VOTING
# ================================

ensemble_probability = (
    gb_prob +
    xgb_prob +
    cat_prob
) / 3

predictions = (
    ensemble_probability >= 0.5
).astype(int)


# ================================
# 9. METRICS
# ================================

accuracy = accuracy_score(
    y_test,
    predictions
)

precision = precision_score(
    y_test,
    predictions,
    zero_division=0
)

recall = recall_score(
    y_test,
    predictions,
    zero_division=0
)

f1 = f1_score(
    y_test,
    predictions,
    zero_division=0
)

mcc = matthews_corrcoef(
    y_test,
    predictions
)

roc_auc = roc_auc_score(
    y_test,
    ensemble_probability
)


# EER
fpr, tpr, thresholds = roc_curve(
    y_test,
    ensemble_probability
)

fnr = 1 - tpr

eer_index = np.nanargmin(
    np.absolute(fnr - fpr)
)

eer = (
    fpr[eer_index] +
    fnr[eer_index]
) / 2


tn, fp, fn, tp = confusion_matrix(
    y_test,
    predictions
).ravel()


# ================================
# 10. RESULTS
# ================================

print("\n================================")
print("EXPERIMENT E RESULTS")
print("Feature-Engineered")
print("GB + CatBoost + XGBoost")
print("================================")

print("Accuracy :", round(accuracy * 100, 2), "%")
print("Precision:", round(precision * 100, 2), "%")
print("Recall   :", round(recall * 100, 2), "%")
print("F1 Score :", round(f1 * 100, 2), "%")
print("MCC      :", round(mcc, 4))
print("ROC-AUC  :", round(roc_auc, 4))
print("EER      :", round(eer * 100, 2), "%")

print("\nCONFUSION MATRIX")
print("True Negative :", tn)
print("False Positive:", fp)
print("False Negative:", fn)
print("True Positive :", tp)