import pandas as pd
import numpy as np
import joblib
import random
import json

def convert_np(obj):
    if isinstance(obj, dict):
        return {k: convert_np(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_np(v) for v in obj]
    elif isinstance(obj, tuple):
        return [convert_np(v) for v in obj]
    elif hasattr(obj, 'item'):
        return obj.item()
    else:
        return obj

# Karnataka region → average annual rainfall (mm)
REGION_RAINFALL = {
    'Bangalore': 900, 'Mysore': 700, 'Hubli': 600,
    'Belgaum': 800, 'Gulbarga': 500, 'Mangalore': 3500,
}

# Load model and base crop averages
model = joblib.load('rabi_model.pkl')
base = pd.read_csv('rabi_data.csv').groupby('Crop Name').mean().reset_index()

def get_water(region):
    return REGION_RAINFALL.get(region, int(np.mean(list(REGION_RAINFALL.values()))))

def predict_crop(c, N, P, K, w):
    X = pd.DataFrame([{
        'Crop Name': c, 'N': N, 'P2O5': P, 'K2O': K, 'Water': w
    }])
    y_pred = model.predict(X)[0]
    return {'Yield': max(0, y_pred[0]), 'Price': max(0, y_pred[1])}

def simulate(start, N, P, K, w, area, used_global):
    seq = []
    curr_N, curr_P, curr_K = N, P, K
    crop = start
    for year in range(1, 4):
        # If any nutrient goes negative, add minimal fertilizer
        fertilizer = {'N': 0, 'P': 0, 'K': 0}
        for nut, curr in zip(['N','P','K'], [curr_N, curr_P, curr_K]):
            if curr < 0:
                fertilizer[nut] = abs(curr) + 1
                if nut == 'N': curr_N = 1
                if nut == 'P': curr_P = 1
                if nut == 'K': curr_K = 1

        pred = predict_crop(crop, curr_N, curr_P, curr_K, w)
        revenue = pred['Yield'] * area * pred['Price']

        seq.append({
            'Year': year,
            'Crop': crop,
            'NPK Before': (curr_N, curr_P, curr_K),
            'Fertilizer Added': (fertilizer['N'], fertilizer['P'], fertilizer['K']),
            'Predicted Yield (q/ha)': round(pred['Yield'], 2),
            'Area (ha)': area,
            'Revenue (INR)': round(revenue, 2)
        })

        # Deplete nutrients
        info = base[base['Crop Name'] == crop].iloc[0]
        curr_N -= info['N_dec']
        curr_P -= info['P_dec']
        curr_K -= info['K_dec']

        used_global.add(crop)
        # Choose next crop: exclude all used so far, pick randomly among top 5 by predicted yield
        candidates = [c for c in base['Crop Name'] if c not in used_global]
        if not candidates:
            break
        ranked = sorted(
            candidates,
            key=lambda c: predict_crop(c, curr_N, curr_P, curr_K, w)['Yield'],
            reverse=True
        )
        crop = random.choice(ranked[:5])

    return seq

if __name__ == "__main__":
    random.seed(42)
    N = float(input("Enter soil N (kg/ha): "))
    P = float(input("Enter soil P2O5 (kg/ha): "))
    K = float(input("Enter soil K2O (kg/ha): "))
    region = input("Enter Karnataka region (e.g., Bangalore, Mysore): ")
    area = float(input("Enter land area (ha): "))
    w = get_water(region)

    used_global = set()
    # Rank initial crops by predicted yield, take top 9
    initial = sorted(
        list(base['Crop Name']),
        key=lambda c: predict_crop(c, N, P, K, w)['Yield'],
        reverse=True
    )[:9]

    plans = {}
    for i in range(3):
        start = initial[i]
        plans[f"Plan {i+1} (Start: {start})"] = simulate(start, N, P, K, w, area, used_global)

    # Output as JSON
    output = []
    for name, seq in plans.items():
        plan = {
            "header": name.strip(),
            "entries": []
        }
        for entry in seq:
            entry = dict(entry)
            if isinstance(entry.get("NPK Before"), tuple):
                entry["NPK Before"] = list(entry["NPK Before"])
            if isinstance(entry.get("Fertilizer Added"), tuple):
                entry["Fertilizer Added"] = list(entry["Fertilizer Added"])
            plan["entries"].append(entry)
        output.append(plan)
    print(json.dumps(convert_np(output)))
