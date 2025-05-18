import pandas as pd
import numpy as np
import joblib
import os
import sys
import json
import logging
from datetime import datetime
from typing import Dict, Any, List, Union

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('crop_predictions.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class NumpyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        return super(NumpyEncoder, self).default(obj)

def validate_input(input_data: Dict[str, Any]) -> List[str]:
    """Validate input parameters and return list of error messages."""
    errors = []
    required_fields = ['location', 'season', 'area', 'n_value', 'p_value', 'k_value']
    
    for field in required_fields:
        if field not in input_data:
            errors.append(f"Missing required field: {field}")
    
    try:
        if 'area' in input_data:
            area = float(input_data['area'])
            if area <= 0:
                errors.append("Area must be positive")
            if area > 10000:  # Assuming max area is 10000 hectares
                errors.append("Area value seems unreasonably large")
    except ValueError:
        errors.append("Area must be a valid number")
    
    # Validate NPK values
    for npk in ['n_value', 'p_value', 'k_value']:
        if npk in input_data:
            try:
                value = float(input_data[npk])
                if value < 0:
                    errors.append(f"{npk} must be non-negative")
                if value > 500:  # Assuming max NPK value is 500
                    errors.append(f"{npk} value seems unreasonably large")
            except ValueError:
                errors.append(f"{npk} must be a valid number")
    
    return errors

def calculate_profit(crop_name: str, yield_value: float, area: float) -> Dict[str, float]:
    # Updated crop prices (₹ per quintal)
    crop_prices = {
        'Rice': 2000,
        'Wheat': 2200,
        'Maize': 1800,
        'Chickpea': 5000,
        'Kidney Beans': 6000,
        'Pigeonpeas': 6500,
        'Mothbeans': 5500,
        'Mungbean': 7000,
        'Blackgram': 6000,
        'Lentil': 5500,
        'Pomegranate': 8000,
        'Banana': 3000,
        'Mango': 4500,
        'Grapes': 7000,
        'Watermelon': 2500,
        'Muskmelon': 3000,
        'Apple': 6000,
        'Orange': 4000,
        'Papaya': 3500,
        'Coconut': 4000,
        'Cotton': 6000,
        'Jute': 4500,
        'Coffee': 9000
    }

    # Base production cost per hectare (₹)
    base_cost_per_hectare = 25000
    
    # Calculate revenue
    price_per_quintal = crop_prices.get(crop_name, 2000)  # Default price if crop not found
    revenue = yield_value * price_per_quintal * area
    
    # Calculate total cost including area-based scaling
    total_cost = base_cost_per_hectare * area
    
    # Calculate profit
    profit = revenue - total_cost
    
    return {
        'revenue': revenue,
        'cost': total_cost,
        'profit': profit
    }

def get_suitable_crops(input_data: Dict[str, Any], model, label_encoders, scaler) -> List[Dict[str, Any]]:
    """Get predictions for all suitable crops based on input conditions."""
    area = float(input_data.get('area'))
    results = []
    
    # Get all unique crops from label encoder
    all_crops = label_encoders['Crop'].classes_
    
    for crop in all_crops:
        try:
            # Create input data copy with current crop
            crop_input = input_data.copy()
            crop_input['crop'] = crop
            
            # Get prediction for this crop
            prediction = predict_yield(crop_input)
            if prediction.get('success') is False:
                continue
                
            prediction['crop'] = crop
            results.append(prediction)
            
        except Exception as e:
            logger.warning(f"Failed to predict for crop {crop}: {str(e)}")
            continue
    
    # Sort by profit in descending order
    results.sort(key=lambda x: x.get('profit', 0), reverse=True)
    
    # Return top 5 most profitable crops
    return results[:5]

def predict_yield(input_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Predict yield for a specific crop based on input parameters.
    
    Args:
        input_data (dict): Dictionary containing input parameters
    
    Returns:
        dict: Prediction results including yield and profit metrics
    """
    try:
        # Load the trained model and preprocessors
        models_dir = os.path.dirname(__file__)
        try:
            model = joblib.load(os.path.join(models_dir, 'crop_yield_model.pkl'))
            label_encoders = joblib.load(os.path.join(models_dir, 'label_encoders.pkl'))
            scaler = joblib.load(os.path.join(models_dir, 'scaler.pkl'))
        except (FileNotFoundError, joblib.JoblibError) as e:
            logger.error(f"Failed to load model files: {str(e)}")
            raise RuntimeError("Model loading failed")

        # If no crop specified, return recommendations for all suitable crops
        if 'crop' not in input_data:
            recommendations = get_suitable_crops(input_data, model, label_encoders, scaler)
            return {
                'success': True,
                'recommendations': recommendations
            }

        # Validate input
        errors = validate_input(input_data)
        if errors:
            logger.error(f"Input validation failed: {errors}")
            raise ValueError("Invalid input data: " + "; ".join(errors))
        
        # Process input data
        area = float(input_data.get('area'))
        
        # Calculate per hectare values
        n_value = float(input_data.get('n_value', 0))
        p_value = float(input_data.get('p_value', 0))
        k_value = float(input_data.get('k_value', 0))
        
        fertilizer = n_value + p_value + k_value  # Total NPK as fertilizer
        pesticide = float(input_data.get('pesticide', 100))  # Default pesticide value
        rainfall = float(input_data.get('annual_rainfall', 1000))  # Default rainfall
        
        # Create feature vector matching the training data columns
        features = [
            'Crop', 'Season', 'State', 'Area',
            'Fertilizer_per_hectare', 'Pesticide_per_hectare', 'Rainfall_per_hectare',
            'Season_Factor', 'Crop_Year'
        ]
        
        feature_values = []
        for feature in features:
            if feature == 'Crop':
                feature_values.append(label_encoders['Crop'].transform([input_data['crop']])[0])
            elif feature == 'Season':
                feature_values.append(label_encoders['Season'].transform([input_data['season']])[0])
            elif feature == 'State':
                feature_values.append(label_encoders['State'].transform([input_data['location']])[0])
            elif feature == 'Area':
                feature_values.append(area)
            elif feature == 'Fertilizer_per_hectare':
                feature_values.append(fertilizer / area)
            elif feature == 'Pesticide_per_hectare':
                feature_values.append(pesticide / area)
            elif feature == 'Rainfall_per_hectare':
                feature_values.append(rainfall / area)
            elif feature == 'Season_Factor':
                season = input_data['season']
                factor = 1.2 if season == 'Winter' else 0.8 if season == 'Summer' else 1.0
                feature_values.append(factor)
            elif feature == 'Crop_Year':
                feature_values.append(2025)
        
        # Scale features
        feature_vector = np.array(feature_values).reshape(1, -1)
        feature_vector_scaled = scaler.transform(feature_vector)
        
        # Make prediction
        yield_prediction = model.predict(feature_vector_scaled)[0]
        
        # Ensure prediction is positive and reasonable
        yield_prediction = max(0.1, min(yield_prediction, 100))  # Cap between 0.1 and 100
        
        # Calculate profit metrics
        profit_metrics = calculate_profit(input_data['crop'], yield_prediction, area)
        
        # Prepare response
        response = {
            'success': True,
            'crop': input_data['crop'],
            'yield': round(float(yield_prediction), 2),
            'profit': round(profit_metrics['profit'], 2),
            'revenue': round(profit_metrics['revenue'], 2),
            'cost': round(profit_metrics['cost'], 2)
        }
        
        return response
        
    except Exception as e:
        logger.error(f"Prediction failed: {str(e)}")
        return {
            'success': False,
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }

if __name__ == "__main__":
    try:
        # Get input data from command line argument
        if len(sys.argv) < 2:
            logger.error("No input data provided")
            print(json.dumps({
                "success": False,
                "error": "No input data provided"
            }))
            sys.exit(1)
        
        input_data = json.loads(sys.argv[1])
        logger.info(f"Received input data: {input_data}")
        
        # Make prediction
        result = predict_yield(input_data)
        
        # Print result as JSON with custom encoder
        print(json.dumps(result, cls=NumpyEncoder))
        sys.exit(0)
        
    except Exception as e:
        logger.error(f"Error in prediction script: {str(e)}")
        print(json.dumps({
            "success": False,
            "error": str(e)
        }))
        sys.exit(1)