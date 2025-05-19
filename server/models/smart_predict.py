import pandas as pd
import numpy as np
import joblib
import os
import json
from typing import Dict, Any, List
import logging
from datetime import datetime

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# State-wise climate data (average values)
STATE_CLIMATE = {
    'Assam': {'temp': 25, 'rainfall': 2000},
    'Bihar': {'temp': 26, 'rainfall': 1200},
    'Gujarat': {'temp': 27, 'rainfall': 800},
    'Karnataka': {'temp': 24, 'rainfall': 900},
    'Kerala': {'temp': 27, 'rainfall': 3000},
    'Madhya Pradesh': {'temp': 25, 'rainfall': 1100},
    'Maharashtra': {'temp': 27, 'rainfall': 1000},
    'Punjab': {'temp': 24, 'rainfall': 700},
    'Tamil Nadu': {'temp': 28, 'rainfall': 1000},
    'Uttar Pradesh': {'temp': 25, 'rainfall': 1000},
    'West Bengal': {'temp': 27, 'rainfall': 2000}
}

# Season temperature adjustments
SEASON_TEMP_ADJUST = {
    'Summer': 4,
    'Winter': -4,
    'Kharif': 2,
    'Rabi': -2,
    'Whole Year': 0
}

def predict_best_crops(input_data: Dict[str, Any]) -> Dict[str, Any]:
    try:
        # Load models and data
        models_dir = os.path.dirname(__file__)
        model = joblib.load(os.path.join(models_dir, 'smart_crop_model.pkl'))
        scaler = joblib.load(os.path.join(models_dir, 'smart_scaler.pkl'))
        crop_info = joblib.load(os.path.join(models_dir, 'crop_info.pkl'))
        
        # Get state climate data
        state = input_data.get('location')
        if state not in STATE_CLIMATE:
            raise ValueError(f"Invalid state: {state}")
        
        climate = STATE_CLIMATE[state]
        
        # Adjust temperature based on season
        season = input_data.get('season')
        temp_adjustment = SEASON_TEMP_ADJUST.get(season, 0)
        temperature = climate['temp'] + temp_adjustment
        
        # Get other input values
        area = float(input_data.get('area', 1))
        n_value = float(input_data.get('n_value', 0))
        p_value = float(input_data.get('p_value', 0))
        k_value = float(input_data.get('k_value', 0))
        
        # Prepare features for prediction
        X = pd.DataFrame([{
            'Temperature': temperature,
            'Rainfall': climate['rainfall'],
            'N_Available': n_value,
            'P_Available': p_value,
            'K_Available': k_value
        }])
        
        # Scale features
        X_scaled = scaler.transform(X)
        
        # Get suitability scores for all crops
        suitability = model.predict(X_scaled)[0]
        
        # Calculate crop-specific scores and yields
        crop_scores = []
        for _, crop_row in crop_info.iterrows():
            # Basic suitability check
            if temperature < crop_row['Min_Temp'] or temperature > crop_row['Max_Temp']:
                continue
                
            if climate['rainfall'] < crop_row['Ideal_Rainfall'] * 0.5:
                continue
            
            # Calculate yield based on suitability and base yield
            predicted_yield = crop_row['Base_Yield'] * suitability
            
            # Calculate economics
            revenue = predicted_yield * area * crop_row['Price_Per_Quintal']
            
            # Calculate cost (base cost + NPK cost)
            base_cost_per_hectare = 25000  # Base cultivation cost
            npk_cost = (n_value + p_value + k_value) * 10  # Approximate NPK cost
            total_cost = (base_cost_per_hectare + npk_cost) * area
            
            profit = revenue - total_cost
            
            crop_scores.append({
                'success': True,
                'crop': crop_row['Crop'],
                'yield': round(predicted_yield, 2),
                'profit': round(profit, 2),
                'revenue': round(revenue, 2),
                'cost': round(total_cost, 2)
            })
        
        # Sort by profit and get top 5
        crop_scores.sort(key=lambda x: x['profit'], reverse=True)
        recommendations = crop_scores[:5]
        
        return {
            'success': True,
            'recommendations': recommendations
        }
        
    except Exception as e:
        logger.error(f"Prediction failed: {str(e)}")
        return {
            'success': False,
            'error': str(e)
        }

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print(json.dumps({
            'success': False,
            'error': 'No input data provided'
        }))
        sys.exit(1)
    
    try:
        input_data = json.loads(sys.argv[1])
        result = predict_best_crops(input_data)
        print(json.dumps(result))
        sys.exit(0)
    except Exception as e:
        print(json.dumps({
            'success': False,
            'error': str(e)
        }))
        sys.exit(1)
