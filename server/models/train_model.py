import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
import joblib
import os

def main():
    print("Loading and processing crop yield dataset...")
    # Load the data
    data_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'crop_yield.csv')
    df = pd.read_csv(data_path)
    
    # Data exploration
    print(f"Dataset shape: {df.shape}")
    print("\nSample data:")
    print(df.head())
    print("\nData information:")
    print(df.info())
    print("\nSummary statistics:")
    print(df.describe())
    
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
    encoders_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'models')
    os.makedirs(encoders_dir, exist_ok=True)
    joblib.dump(label_encoders, os.path.join(encoders_dir, 'label_encoders.pkl'))
    
    # Feature engineering
    print("\nPerforming feature engineering...")
    df['NPK_Ratio'] = df['Fertilizer'] / df['Area']
    df['Pesticide_Ratio'] = df['Pesticide'] / df['Area']
    df['Rainfall_Per_Area'] = df['Annual_Rainfall'] / df['Area']
    
    # Feature selection
    features = ['Crop', 'Season', 'State', 'Area', 'Annual_Rainfall', 
                'Fertilizer', 'Pesticide', 'NPK_Ratio', 'Pesticide_Ratio', 
                'Rainfall_Per_Area', 'Crop_Year']
    
    X = df[features]
    y = df['Yield']  # Target variable
    
    # Standardize features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Save the scaler for later use
    joblib.dump(scaler, os.path.join(encoders_dir, 'scaler.pkl'))
    
    # Split data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)
    
    # Train the model
    print("\nTraining Gradient Boosting Regressor model...")
    model = GradientBoostingRegressor(
        n_estimators=100,
        learning_rate=0.1,
        max_depth=3,
        random_state=42
    )
    
    model.fit(X_train, y_train)
    
    # Evaluate the model
    train_score = model.score(X_train, y_train)
    test_score = model.score(X_test, y_test)
    
    print(f"\nModel R² score on training data: {train_score:.4f}")
    print(f"Model R² score on testing data: {test_score:.4f}")
    
    # Get feature importance
    feature_importance = pd.DataFrame({
        'Feature': features,
        'Importance': model.feature_importances_
    }).sort_values('Importance', ascending=False)
    
    print("\nFeature Importance:")
    print(feature_importance)
    
    # Save the model
    model_path = os.path.join(encoders_dir, 'crop_yield_model.pkl')
    joblib.dump(model, model_path)
    print(f"\nModel saved to {model_path}")
    
    # Generate synthetic dataset for future predictions
    create_synthetic_dataset(df, label_encoders)
    
    return model, label_encoders, scaler

def create_synthetic_dataset(df, label_encoders):
    """Create a synthetic dataset with forecasted data for future years."""
    print("\nGenerating synthetic dataset for future predictions...")
    
    # Calculate average values for NPK depletion rates based on crop type
    crop_npk_depletion = {}
    crops = df['Crop'].unique()
    
    for crop in crops:
        crop_data = df[df['Crop'] == crop]
        if len(crop_data) > 1:
            # Calculate average NPK usage per yield unit
            avg_npk_per_yield = crop_data['NPK_Ratio'].mean() / crop_data['Yield'].mean()
            crop_npk_depletion[crop] = avg_npk_per_yield
        else:
            # Default value if not enough data
            crop_npk_depletion[crop] = 0.05
    
    # Create synthetic data for 2025-2030
    future_years = list(range(2025, 2031))
    synthetic_data = []
    
    # Get sample states and seasons
    states = df['State'].unique()
    seasons = df['Season'].unique()
    
    for crop in crops:
        for year in future_years:
            for state in states[:5]:  # Limit to first 5 states for simplicity
                for season in seasons[:2]:  # Limit to first 2 seasons
                    # Base values from historical averages
                    crop_data = df[df['Crop'] == crop]
                    if len(crop_data) > 0:
                        avg_area = crop_data['Area'].mean()
                        avg_rainfall = crop_data['Annual_Rainfall'].mean()
                        avg_fertilizer = crop_data['Fertilizer'].mean()
                        avg_pesticide = crop_data['Pesticide'].mean()
                        avg_yield = crop_data['Yield'].mean()
                        
                        # Add some random variation
                        area = avg_area * np.random.uniform(0.9, 1.1)
                        rainfall = avg_rainfall * np.random.uniform(0.9, 1.1)
                        
                        # Adjust values based on future year (accounting for climate change, etc.)
                        year_factor = 1 + 0.01 * (year - 2025)
                        fertilizer = avg_fertilizer * year_factor * np.random.uniform(0.95, 1.05)
                        pesticide = avg_pesticide * year_factor * np.random.uniform(0.95, 1.05)
                        
                        # Project yield trends (increasing with technology)
                        yield_value = avg_yield * (1 + 0.02 * (year - 2025)) * np.random.uniform(0.9, 1.1)
                        
                        # Calculate production
                        production = yield_value * area
                        
                        # Create data point
                        data_point = {
                            'Crop': crop,
                            'Crop_Year': year,
                            'Season': season,
                            'State': state,
                            'Area': area,
                            'Production': production,
                            'Annual_Rainfall': rainfall,
                            'Fertilizer': fertilizer,
                            'Pesticide': pesticide,
                            'Yield': yield_value,
                            'NPK_Ratio': fertilizer / area,
                            'Pesticide_Ratio': pesticide / area,
                            'Rainfall_Per_Area': rainfall / area
                        }
                        synthetic_data.append(data_point)
    
    # Convert to DataFrame
    synthetic_df = pd.DataFrame(synthetic_data)
    
    # Save synthetic dataset
    output_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'synthetic_future_data.csv')
    synthetic_df.to_csv(output_path, index=False)
    print(f"Synthetic dataset saved to {output_path}")

if __name__ == "__main__":
    main() 