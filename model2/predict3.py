import pickle
import numpy as np
import pandas as pd

# Load model and encoders
with open('crop_model2.pkl', 'rb') as f:
    model = pickle.load(f)

with open('encoders.pkl', 'rb') as f:
    encoders = pickle.load(f)
    soil_encoder = encoders['soil']
    crop_encoder = encoders['crop']
    fertilizer_encoder = encoders['fertilizer']

# Show valid options
print("\n Valid Soil Types:", list(soil_encoder.classes_))
print(" Valid Crop Types:", list(crop_encoder.classes_))
print(" Valid Fertilizer Types:", list(fertilizer_encoder.classes_))


# Get input
N = float(input("\nEnter Nitrogen level: "))
P = float(input("Enter Phosphorus level: "))
K = float(input("Enter Potassium level: "))
Temperature = float(input("Enter Temperature: "))
Humidity = float(input("Enter Humidity: "))
Moisture = float(input("Enter Moisture: "))
Soil = input("Enter Soil Type: ").strip().capitalize()
Crop = input("Enter Crop Type: ").strip().capitalize()

# Encode input
try:
    Soil_encoded = soil_encoder.transform([Soil])[0]
    Crop_encoded = crop_encoder.transform([Crop])[0]
except ValueError:
    print(" Invalid Soil or Crop Type. Please copy from the valid list above.")
    exit()

# # Predict
features = np.array([[N, P, K, Temperature, Humidity, Moisture, Soil_encoded, Crop_encoded]])\

# features = pd.DataFrame([[N, P, K, Temperature, Humidity, Moisture, Soil_encoded, Crop_encoded]], columns=['Nitrogen', 'Phosphorous', 'Potassium', 'Temparature', 'Humidity', 'Moisture', 'Soil Type', 'Crop Type'])

prediction = model.predict(features)
fertilizer = fertilizer_encoder.inverse_transform(prediction)[0]

print(f"\n Recommended Fertilizer: {fertilizer}")
