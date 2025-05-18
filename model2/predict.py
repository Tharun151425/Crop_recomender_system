# predict.py
import pandas as pd
import joblib
import numpy as np
from itertools import product

# Load models
clf = joblib.load("crop_model.pkl")
le_crop = joblib.load("le_crop.pkl")
le_soil = joblib.load("le_soil.pkl")
le_var = joblib.load("le_var.pkl")

# Ask user input
years = int(input("Enter planning years (e.g., 4): "))
N = float(input("Enter Nitrogen level: "))
P = float(input("Enter Phosphorus level: "))
K = float(input("Enter Potassium level: "))
temp = float(input("Enter Temperature: "))
humidity = float(input("Enter Humidity: "))
pH = float(input("Enter pH value: "))
rain = float(input("Enter Rainfall: "))
soil = input("Enter Soil Type (e.g., Clay): ")
variety = input("Enter Variety (e.g., Soft Red): ")

soil_encoded = le_soil.transform([soil])[0] if soil in le_soil.classes_ else 0
var_encoded = le_var.transform([variety])[0] if variety in le_var.classes_ else 0

# Define nutrient depletion per year (synthetic assumption)
def deplete(n, p, k):
    return max(n - 10, 0), max(p - 5, 0), max(k - 5, 0)

# Generate all crop sequences of given years
crop_ids = list(range(len(le_crop.classes_)))
sequences = list(product(crop_ids, repeat=years))

best_yields = []

for seq in sequences:
    total_score = 0
    n, p, k = N, P, K
    for crop_id in seq:
        x = pd.DataFrame([[n, p, k, temp, humidity, pH, rain, soil_encoded, var_encoded]], columns=['Nitrogen', 'Phosphorus', 'Potassium', 'Temperature', 'Humidity', 'pH_Value', 'Rainfall', 'Soil_Type', 'Variety'])
        pred = clf.predict_proba(x)[0][crop_id]
        total_score += pred
        n, p, k = deplete(n, p, k)
    best_yields.append((seq, total_score))

# Get top 3 combinations
top3 = sorted(best_yields, key=lambda x: x[1], reverse=True)[:3]

print("\nTop 3 crop rotation combinations:")
for idx, (seq, score) in enumerate(top3, 1):
    crop_names = [le_crop.inverse_transform([i])[0] for i in seq]
    print(f"{idx}. {crop_names} — Total Suitability Score: {score:.2f}")
