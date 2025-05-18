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

class NumpyJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, (np.integer, np.floating)):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        return super(NumpyJSONEncoder, self).default(obj)

def convert_numpy_types(obj):
    if isinstance(obj, (np.intc, np.intp, np.int8, np.int16, np.int32,
                       np.int64, np.uint8, np.uint16, np.uint32, np.uint64)):
        return int(obj)
    elif isinstance(obj, (np.float16, np.float32, np.float64)):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, dict):
        return {key: convert_numpy_types(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_numpy_types(item) for item in obj]
    return obj

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
        suitability = float(model.predict(X_scaled)[0])  # Convert to native Python float
        
        # Calculate crop-specific scores and yields
        crop_scores = []
        for _, crop_row in crop_info.iterrows():
            # Convert DataFrame row to dict with native Python types
            crop_data = {
                col: convert_numpy_types(val) 
                for col, val in crop_row.items()
            }
            
            # Basic suitability check
            if temperature < crop_data['Min_Temp'] or temperature > crop_data['Max_Temp']:
                continue
                
            if climate['rainfall'] < crop_data['Ideal_Rainfall'] * 0.5:
                continue
            
            # Calculate yield based on suitability and base yield
            predicted_yield = crop_data['Base_Yield'] * suitability
            
            # Calculate economics
            revenue = predicted_yield * area * crop_data['Price_Per_Quintal']
            
            # Calculate cost (base cost + NPK cost)
            base_cost_per_hectare = 25000  # Base cultivation cost
            npk_cost = (n_value + p_value + k_value) * 10  # Approximate NPK cost
            total_cost = (base_cost_per_hectare + npk_cost) * area
            
            profit = revenue - total_cost
            
            crop_scores.append({
                'success': True,
                'crop': crop_data['Crop'],
                'yield': float(round(predicted_yield, 2)),
                'profit': float(round(profit, 2)),
                'revenue': float(round(revenue, 2)),
                'cost': float(round(total_cost, 2))
            })
        
        # Sort by profit and get top 5
        crop_scores.sort(key=lambda x: x['profit'], reverse=True)
        recommendations = crop_scores[:5]
        
        # Convert any remaining NumPy types to native Python types
        recommendations = convert_numpy_types(recommendations)
          # Include input data in response
        input_summary = {
            'location': input_data.get('location'),
            'season': input_data.get('season'),
            'area': float(input_data.get('area', 1)),
            'n_value': float(input_data.get('n_value', 0)),
            'p_value': float(input_data.get('p_value', 0)),
            'k_value': float(input_data.get('k_value', 0))
        }
        
        return {
            'success': True,
            'recommendations': recommendations,
            'input': input_summary
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
        # Use custom encoder to handle NumPy types
        print(json.dumps(result, cls=NumpyJSONEncoder))
        sys.exit(0)
    except Exception as e:
        print(json.dumps({
            'success': False,
            'error': str(e)
        }))
        sys.exit(1)
