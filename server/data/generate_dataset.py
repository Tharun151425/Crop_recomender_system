import pandas as pd
import numpy as np
from datetime import datetime
import calendar

def generate_crop_dataset():
    # List of all states and seasons
    states = ['Assam', 'Karnataka', 'Kerala', 'Meghalaya', 'West Bengal', 'Puducherry', 
              'Goa', 'Andhra Pradesh', 'Tamil Nadu', 'Odisha', 'Bihar', 'Gujarat', 
              'Madhya Pradesh', 'Maharashtra', 'Mizoram', 'Punjab', 'Uttar Pradesh', 
              'Haryana', 'Himachal Pradesh', 'Tripura', 'Nagaland', 'Chhattisgarh', 
              'Uttarakhand', 'Jharkhand', 'Delhi', 'Manipur', 'Jammu and Kashmir', 
              'Telangana', 'Arunachal Pradesh', 'Sikkim']
    
    seasons = ['Whole Year', 'Kharif', 'Rabi', 'Autumn', 'Summer', 'Winter']
    
    crops = ['Arecanut', 'Arhar/Tur', 'Castor seed', 'Cotton(lint)', 'Dry chillies', 
             'Gram', 'Jute', 'Linseed', 'Maize', 'Mesta', 'Niger seed', 'Onion', 
             'Other Rabi pulses', 'Potato', 'Rapeseed &Mustard', 'Rice', 'Sesamum', 
             'Small millets', 'Sugarcane', 'Sweet potato', 'Tapioca', 'Tobacco', 
             'Turmeric', 'Wheat', 'Bajra', 'Black pepper', 'Cardamom', 'Coriander', 
             'Garlic', 'Ginger', 'Groundnut', 'Horse-gram', 'Jowar', 'Ragi', 
             'Cashewnut', 'Banana', 'Soyabean', 'Barley', 'Khesari', 'Masoor', 
             'Moong(Green Gram)', 'Other Kharif pulses', 'Safflower', 'Sannhamp', 
             'Sunflower', 'Urad', 'Peas & beans (Pulses)', 'other oilseeds', 
             'Other Cereals', 'Cowpea(Lobia)', 'Oilseeds total', 'Guar seed', 
             'Other Summer Pulses', 'Moth']
    
    # Define realistic ranges for each feature
    rainfall_by_state = {
        'Kerala': (2000, 4000),
        'Assam': (1500, 3000),
        'West Bengal': (1000, 2500),
        'Karnataka': (500, 2000),
        # Default range for other states
        'default': (600, 2000)
    }
    
    # Create empty list to store data
    data = []
    
    # Current year
    current_year = datetime.now().year
    
    # Generate data for past 5 years
    for year in range(current_year - 5, current_year + 1):
        for state in states:
            rainfall_range = rainfall_by_state.get(state, rainfall_by_state['default'])
            annual_rainfall = np.random.uniform(rainfall_range[0], rainfall_range[1])
            
            for season in seasons:
                # Not all crops grow in all seasons
                eligible_crops = [crop for crop in crops if is_crop_suitable(crop, season)]
                
                for crop in eligible_crops:
                    # Generate realistic area (hectares)
                    area = np.random.uniform(100, 10000)
                    
                    # Calculate base yield based on crop type
                    base_yield = get_base_yield(crop)
                    
                    # Adjust yield based on rainfall and season
                    rainfall_factor = get_rainfall_factor(annual_rainfall, crop)
                    season_factor = get_season_factor(season, crop)
                    
                    # Calculate final yield
                    yield_value = base_yield * rainfall_factor * season_factor * np.random.uniform(0.8, 1.2)
                    
                    # Calculate production
                    production = yield_value * area
                    
                    # Calculate fertilizer and pesticide usage
                    fertilizer = area * np.random.uniform(80, 200)  # kg per hectare
                    pesticide = area * np.random.uniform(0.2, 0.5)  # kg per hectare
                    
                    data.append({
                        'Crop': crop,
                        'Crop_Year': year,
                        'Season': season,
                        'State': state,
                        'Area': round(area, 2),
                        'Production': round(production, 2),
                        'Annual_Rainfall': round(annual_rainfall, 2),
                        'Fertilizer': round(fertilizer, 2),
                        'Pesticide': round(pesticide, 2),
                        'Yield': round(yield_value, 2)
                    })
    
    # Convert to DataFrame
    df = pd.DataFrame(data)
    
    # Save to CSV
    df.to_csv('crop_yield.csv', index=False)
    print(f"Generated dataset with {len(df)} records")
    return df

def is_crop_suitable(crop, season):
    kharif_crops = ['Rice', 'Maize', 'Soyabean', 'Cotton(lint)', 'Groundnut']
    rabi_crops = ['Wheat', 'Gram', 'Rapeseed &Mustard', 'Potato']
    
    if season == 'Kharif':
        return crop in kharif_crops
    elif season == 'Rabi':
        return crop in rabi_crops
    else:
        return True

def get_base_yield(crop):
    # Define base yields for different crop types
    high_yield_crops = ['Sugarcane', 'Potato', 'Banana']
    medium_yield_crops = ['Rice', 'Wheat', 'Maize']
    
    if crop in high_yield_crops:
        return np.random.uniform(40, 80)
    elif crop in medium_yield_crops:
        return np.random.uniform(3, 6)
    else:
        return np.random.uniform(1, 3)

def get_rainfall_factor(rainfall, crop):
    # Different crops have different rainfall requirements
    if rainfall < 500:
        return 0.7
    elif rainfall < 1000:
        return 0.9
    elif rainfall < 2000:
        return 1.0
    else:
        return 0.95

def get_season_factor(season, crop):
    # Adjust yield based on whether it's the optimal growing season
    optimal_seasons = {
        'Rice': ['Kharif'],
        'Wheat': ['Rabi'],
        'Maize': ['Kharif', 'Rabi'],
        'Potato': ['Rabi'],
        'Sugarcane': ['Whole Year']
    }
    
    if crop in optimal_seasons and season in optimal_seasons[crop]:
        return 1.2
    return 0.8

if __name__ == "__main__":
    generate_crop_dataset()
