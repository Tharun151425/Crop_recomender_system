import pandas as pd
import numpy as np
import joblib
import os
import sys
import json
from datetime import datetime

def predict_best_crop(input_data):
    """
    Predict the best crop based on input parameters.
    
    Args:
        input_data (dict): Dictionary containing input parameters
            - previous_crop: The previous crop grown on the land
            - location: State where the land is located
            - n_value: Nitrogen value of the soil
            - p_value: Phosphorus value of the soil
            - k_value: Potassium value of the soil
            - area: Area of the land in hectares
            - season: Season for planting (e.g., Kharif, Rabi)
    
    Returns:
        dict: Prediction results including best crop and 5-year forecast
    """
    try:
        # Load the trained model and preprocessors
        models_dir = os.path.dirname(__file__)
        model = joblib.load(os.path.join(models_dir, 'crop_yield_model.pkl'))
        label_encoders = joblib.load(os.path.join(models_dir, 'label_encoders.pkl'))
        scaler = joblib.load(os.path.join(models_dir, 'scaler.pkl'))
        
        # Load synthetic future data
        data_dir = os.path.join(os.path.dirname(models_dir), 'data')
        synthetic_data = pd.read_csv(os.path.join(data_dir, 'synthetic_future_data.csv'))
        
        # Process input data
        state = input_data.get('location')
        season = input_data.get('season')
        area = float(input_data.get('area'))
        n_value = float(input_data.get('n_value'))
        p_value = float(input_data.get('p_value'))
        k_value = float(input_data.get('k_value'))
        
        # Calculate total NPK
        total_npk = n_value + p_value + k_value
        
        # Filter synthetic data for the given state and season
        filtered_data = synthetic_data
        if state in label_encoders['State'].classes_:
            state_encoded = label_encoders['State'].transform([state])[0]
            filtered_data = filtered_data[filtered_data['State'] == state_encoded]
        
        if season in label_encoders['Season'].classes_:
            season_encoded = label_encoders['Season'].transform([season])[0]
            filtered_data = filtered_data[filtered_data['Season'] == season_encoded]
        
        # If no data matches the filters, use all data
        if len(filtered_data) == 0:
            filtered_data = synthetic_data
        
        # Create test cases for each crop in the dataset
        unique_crops = np.unique(filtered_data['Crop'])
        
        current_year = 2025
        future_years = 5
        
        results = []
        for crop_code in unique_crops:
            # Get the crop name
            crop_name = label_encoders['Crop'].inverse_transform([crop_code])[0]
            
            crop_forecast = []
            
            # Get average rainfall for the state
            avg_rainfall = filtered_data['Annual_Rainfall'].mean()
            
            # Define NPK depletion rates (these would ideally come from a database or model)
            # Using simplified assumptions for demonstration
            npk_depletion_rates = {
                'Nitrogen': 0.1,  # 10% per year
                'Phosphorus': 0.05,  # 5% per year
                'Potassium': 0.07,  # 7% per year
            }
            
            # Adjust depletion rates based on crop type (again, simplified)
            if crop_name in ['Rice', 'Wheat', 'Maize']:
                npk_depletion_rates['Nitrogen'] *= 1.2
            elif crop_name in ['Groundnut', 'Soyabean']:
                npk_depletion_rates['Phosphorus'] *= 1.3
            elif crop_name in ['Sugarcane', 'Potato']:
                npk_depletion_rates['Potassium'] *= 1.4
                
            current_n = n_value
            current_p = p_value
            current_k = k_value
            
            # 5-year forecast
            for year_offset in range(future_years):
                year = current_year + year_offset
                
                # Create input data for prediction
                fertilizer = (current_n + current_p + current_k) * area * 100  # Simplified calculation
                pesticide = area * 30  # Simplified calculation
                
                # The actual feature vector needs to match the training data format
                test_data = {
                    'Crop': crop_code,
                    'Season': season_encoded if season in label_encoders['Season'].classes_ else 0,
                    'State': state_encoded if state in label_encoders['State'].classes_ else 0,
                    'Area': area,
                    'Annual_Rainfall': avg_rainfall,
                    'Fertilizer': fertilizer,
                    'Pesticide': pesticide,
                    'NPK_Ratio': fertilizer / area,
                    'Pesticide_Ratio': pesticide / area,
                    'Rainfall_Per_Area': avg_rainfall / area,
                    'Crop_Year': year
                }
                
                # Convert to DataFrame for prediction
                test_df = pd.DataFrame([test_data])
                
                # Scale the features
                test_features = scaler.transform(test_df)
                
                # Predict yield
                predicted_yield = float(model.predict(test_features)[0])
                
                # Calculate estimated production and profit
                estimated_production = predicted_yield * area
                
                # Simple profit calculation - this would be more complex in reality
                # Using a simplified price model based on crop type
                base_price_per_unit = 15  # Base price
                if crop_name in ['Rice', 'Wheat']:
                    price_per_unit = base_price_per_unit * 1.2
                elif crop_name in ['Potato', 'Onion']:
                    price_per_unit = base_price_per_unit * 1.5
                elif crop_name in ['Sugarcane']:
                    price_per_unit = base_price_per_unit * 0.8
                else:
                    price_per_unit = base_price_per_unit
                    
                estimated_profit = estimated_production * price_per_unit
                
                # Factor in costs (simplified)
                cost_per_hectare = 200  # Base cost per hectare
                if crop_name in ['Rice', 'Sugarcane']:
                    cost_per_hectare *= 1.3  # Higher water usage
                
                total_cost = cost_per_hectare * area
                net_profit = estimated_profit - total_cost
                
                # Update NPK values for next year based on crop depletion
                current_n = current_n * (1 - npk_depletion_rates['Nitrogen'])
                current_p = current_p * (1 - npk_depletion_rates['Phosphorus'])
                current_k = current_k * (1 - npk_depletion_rates['Potassium'])
                
                crop_forecast.append({
                    'year': year,
                    'n_value': round(current_n, 2),
                    'p_value': round(current_p, 2),
                    'k_value': round(current_k, 2),
                    'yield': round(predicted_yield, 2),
                    'production': round(estimated_production, 2),
                    'profit': round(net_profit, 2)
                })
            
            # Calculate overall metrics for 5 years
            total_profit = sum(year_data['profit'] for year_data in crop_forecast)
            avg_yield = sum(year_data['yield'] for year_data in crop_forecast) / len(crop_forecast)
            
            # Add this crop's results to the overall results
            results.append({
                'crop': crop_name,
                'total_profit': round(total_profit, 2),
                'average_yield': round(avg_yield, 2),
                'forecast': crop_forecast
            })
        
        # Sort results by total profit (descending)
        results.sort(key=lambda x: x['total_profit'], reverse=True)
        
        # Get the top 5 recommended crops
        top_recommendations = results[:5]
        
        # Select the best crop (highest profit)
        best_crop = top_recommendations[0]['crop'] if top_recommendations else "No recommendation available"
        
        return {
            'best_crop': best_crop,
            'top_recommendations': top_recommendations,
            'message': f"Based on the provided soil conditions and location, {best_crop} is recommended for optimal yield and profit."
        }
    
    except Exception as e:
        print(f"Error in prediction: {str(e)}", file=sys.stderr)
        return {
            'error': str(e),
            'message': "Failed to generate prediction. Please check your input data."
        }

if __name__ == "__main__":
    # Read input JSON from stdin
    input_json = sys.stdin.read()
    input_data = json.loads(input_json)
    
    # Generate prediction
    results = predict_best_crop(input_data)
    
    # Output results as JSON
    print(json.dumps(results)) 