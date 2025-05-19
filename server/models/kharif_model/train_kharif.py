# train_kharif.py

import pandas as pd
import numpy as np
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.multioutput import MultiOutputRegressor
from xgboost import XGBRegressor
from sklearn.model_selection import RandomizedSearchCV
import joblib

# 1. Load data
df = pd.read_csv('crop4\\kharif_data.csv')
X = df[['Crop Name', 'N', 'P2O5', 'K2O', 'Water']]
y = df[['Yield', 'Price']]

# 2. Preprocessing pipeline
preprocessor = ColumnTransformer([
    ('crop_enc', OneHotEncoder(sparse_output=False, handle_unknown='ignore'), ['Crop Name'])
], remainder='passthrough')

# 3. XGBoost regressor wrapped for multi-output
xgb = MultiOutputRegressor(XGBRegressor(objective='reg:squarederror', eval_metric='rmse', use_label_encoder=False))

pipeline = Pipeline([
    ('prep', preprocessor),
    ('model', xgb)
])

# 4. Hyperparameter grid
param_dist = {
    'model__estimator__n_estimators': [50, 100, 200],
    'model__estimator__max_depth': [3, 5, 7],
    'model__estimator__learning_rate': [0.01, 0.1, 0.2],
    'model__estimator__subsample': [0.6, 0.8, 1.0],
    'model__estimator__colsample_bytree': [0.6, 0.8, 1.0],
}

# 5. Randomized Search CV
random_search = RandomizedSearchCV(
    pipeline, param_distributions=param_dist,
    n_iter=50, cv=3, verbose=2, n_jobs=-1, random_state=42
)

random_search.fit(X, y)

# 6. Save best model
joblib.dump(random_search.best_estimator_, 'kharif_model.pkl')
print("Best Parameters:", random_search.best_params_)
print("Model saved to kharif_model.pkl")
