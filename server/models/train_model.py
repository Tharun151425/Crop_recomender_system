import pandas as pd
import numpy as np
import os
import joblib
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.preprocessing import LabelEncoder, StandardScaler
import xgboost as xgb
from sklearn.metrics import mean_squared_error, r2_score

def train_model():
    print("Loading and processing crop yield dataset...")
    # Load the data
    data_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'crop_yield.csv')
    df = pd.read_csv(data_path)
    
    print(f"Dataset shape: {df.shape}")
    print("\nSample data:")
    print(df.head())
    
    # Check for missing values
    print("\nMissing values count:")
    print(df.isnull().sum())
    
    # Encode categorical variables
    print("\nEncoding categorical variables...")
    label_encoders = {}
    for column in ['Crop', 'Season', 'State']:
        le = LabelEncoder()
        df[column] = le.fit_transform(df[column])
        label_encoders[column] = le
    
    # Save the label encoders for later use
    encoders_dir = os.path.dirname(__file__)
    os.makedirs(encoders_dir, exist_ok=True)
    joblib.dump(label_encoders, os.path.join(encoders_dir, 'label_encoders.pkl'))
    
    # Feature engineering with correct column names
    print("\nPerforming feature engineering...")
    
    df['Fertilizer_per_hectare'] = df['Fertilizer'] / df['Area']
    df['Pesticide_per_hectare'] = df['Pesticide'] / df['Area']
    df['Rainfall_per_hectare'] = df['Annual_Rainfall'] / df['Area']
    
    # Season factor calculation
    df['Season_Factor'] = df.apply(
        lambda x: 1.2 if x['Season'] == 'Winter'
        else 0.8 if x['Season'] == 'Summer'
        else 1.0, axis=1
    )
    
    # Feature selection with available columns
    features = [
        'Crop', 'Season', 'State', 'Area',
        'Fertilizer_per_hectare', 'Pesticide_per_hectare', 'Rainfall_per_hectare',
        'Season_Factor', 'Crop_Year'
    ]
    
    X = df[features]
    y = df['Yield']  # Target variable
    
    # Standardize features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Save the scaler for later use
    joblib.dump(scaler, os.path.join(encoders_dir, 'scaler.pkl'))
    
    # Split data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)
    
    # Initialize XGBoost model
    xgb_model = xgb.XGBRegressor(random_state=42)
    
    # Parameter distribution for random search
    param_distributions = {
        'n_estimators': [100, 200],  # Reduced number of trees
        'max_depth': [3, 4, 5],
        'learning_rate': [0.05, 0.1],
        'subsample': [0.8, 0.9],
        'colsample_bytree': [0.8, 0.9],
        'min_child_weight': [3, 5],
        'gamma': [0, 0.1]
    }
    
    # Perform random search with cross-validation
    print("\nPerforming random search for hyperparameter tuning...")
    random_search = RandomizedSearchCV(
        estimator=xgb_model,
        param_distributions=param_distributions,
        n_iter=10,  # Number of parameter settings sampled
        scoring='neg_mean_squared_error',
        cv=3,  # Reduced number of cross-validation folds
        n_jobs=-1,
        verbose=2,
        random_state=42
    )
    
    random_search.fit(X_train, y_train)
    
    # Get best model
    best_model = random_search.best_estimator_
    
    # Evaluate the model
    train_score = best_model.score(X_train, y_train)
    test_score = best_model.score(X_test, y_test)
    
    print(f"\nBest parameters found: {random_search.best_params_}")
    print(f"\nModel R² score on training data: {train_score:.4f}")
    print(f"Model R² score on testing data: {test_score:.4f}")
    
    # Get feature importance
    feature_importance = pd.DataFrame({
        'Feature': features,
        'Importance': best_model.feature_importances_
    }).sort_values('Importance', ascending=False)
    
    print("\nFeature Importance:")
    print(feature_importance)
    
    # Save the model
    model_path = os.path.join(encoders_dir, 'crop_yield_model.pkl')
    joblib.dump(best_model, model_path)
    print(f"\nModel saved to {model_path}")
    
    return best_model, label_encoders, scaler

if __name__ == "__main__":
    train_model()