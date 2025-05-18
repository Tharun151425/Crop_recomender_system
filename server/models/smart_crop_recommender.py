import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split, RandomizedSearchCV
import xgboost as xgb
import joblib
import os

def calculate_suitability_score(row, temp, rainfall, n_value, p_value, k_value):
    """Calculate how suitable a crop is based on conditions"""
    
    # Temperature suitability (0-1)
    temp_suit = 1.0
    if temp < row['Min_Temp'] or temp > row['Max_Temp']:
        temp_suit = 0.3
    elif temp < row['Min_Temp'] + 2 or temp > row['Max_Temp'] - 2:
        temp_suit = 0.7
    
    # Rainfall suitability (0-1)
    rain_suit = min(1.0, rainfall / row['Ideal_Rainfall']) if rainfall <= row['Ideal_Rainfall'] * 1.2 else \
                0.7 if rainfall <= row['Ideal_Rainfall'] * 1.5 else 0.3
    
    # NPK suitability (0-1)
    n_suit = min(1.0, n_value / row['N_Required']) if n_value <= row['N_Required'] * 1.2 else \
             0.7 if n_value <= row['N_Required'] * 1.5 else 0.5
    
    p_suit = min(1.0, p_value / row['P_Required']) if p_value <= row['P_Required'] * 1.2 else \
             0.7 if p_value <= row['P_Required'] * 1.5 else 0.5
    
    k_suit = min(1.0, k_value / row['K_Required']) if k_value <= row['K_Required'] * 1.2 else \
             0.7 if k_value <= row['K_Required'] * 1.5 else 0.5
    
    # Overall suitability score
    return (temp_suit * 0.3 + rain_suit * 0.3 + (n_suit + p_suit + k_suit) * 0.4 / 3)

def train_model():
    print("Loading and processing crop dataset...")
    
    # Load the data
    data_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'india_crop_data.csv')
    df = pd.read_csv(data_path)
    
    # Create training samples with variations
    training_data = []
    for _, row in df.iterrows():
        # Generate multiple samples per crop with varying conditions
        for _ in range(10):  # 10 variations per crop
            temp_var = np.random.uniform(-2, 2)
            rain_var = np.random.uniform(-200, 200)
            npk_var = np.random.uniform(-10, 10)
            
            sample = {
                'State': row['State'],
                'Temperature': row['Avg_Temp'] + temp_var,
                'Rainfall': row['Annual_Rainfall'] + rain_var,
                'N_Available': row['N_Required'] + npk_var,
                'P_Available': row['P_Required'] + npk_var,
                'K_Available': row['K_Required'] + npk_var,
                'Crop': row['Crop'],
                'Suitability': calculate_suitability_score(
                    row,
                    row['Avg_Temp'] + temp_var,
                    row['Annual_Rainfall'] + rain_var,
                    row['N_Required'] + npk_var,
                    row['P_Required'] + npk_var,
                    row['K_Required'] + npk_var
                )
            }
            training_data.append(sample)
    
    train_df = pd.DataFrame(training_data)
    
    # Save crop info for prediction phase
    crop_info = df[['Crop', 'N_Required', 'P_Required', 'K_Required', 'Base_Yield', 'Price_Per_Quintal',
                    'Min_Temp', 'Max_Temp', 'Ideal_Rainfall']].copy()
    joblib.dump(crop_info, os.path.join(os.path.dirname(__file__), 'crop_info.pkl'))
    
    # Prepare features for training
    print("\nPreparing features...")
    features = ['Temperature', 'Rainfall', 'N_Available', 'P_Available', 'K_Available']
    X = train_df[features]
    y = train_df['Suitability']
    
    # Split and scale data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Save the scaler
    joblib.dump(scaler, os.path.join(os.path.dirname(__file__), 'smart_scaler.pkl'))
    
    # Train model with RandomizedSearchCV
    print("\nTraining model with RandomizedSearchCV...")
    xgb_model = xgb.XGBRegressor(objective='reg:squarederror', random_state=42)
    
    param_distributions = {
        'n_estimators': [100, 200],
        'max_depth': [3, 4, 5],
        'learning_rate': [0.01, 0.05, 0.1],
        'subsample': [0.8, 0.9],
        'colsample_bytree': [0.8, 0.9],
        'min_child_weight': [1, 3, 5]
    }
    
    random_search = RandomizedSearchCV(
        estimator=xgb_model,
        param_distributions=param_distributions,
        n_iter=100,  # More comprehensive search
        scoring='neg_mean_squared_error',
        cv=3,
        verbose=1,
        random_state=42
    )
    
    random_search.fit(X_train_scaled, y_train)
    
    # Get best model
    best_model = random_search.best_estimator_
    
    # Save the model
    joblib.dump(best_model, os.path.join(os.path.dirname(__file__), 'smart_crop_model.pkl'))
    
    # Print model performance
    train_score = best_model.score(X_train_scaled, y_train)
    test_score = best_model.score(X_test_scaled, y_test)
    
    print(f"\nBest parameters: {random_search.best_params_}")
    print(f"Train R² score: {train_score:.4f}")
    print(f"Test R² score: {test_score:.4f}")
    
    return best_model, scaler, crop_info

if __name__ == "__main__":
    train_model()
