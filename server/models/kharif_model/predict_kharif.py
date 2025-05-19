import pandas as pd
import numpy as np
import joblib
import random

# Mapping of Karnataka regions to typical annual rainfall (mm)
REGION_RAINFALL = {
    'Bangalore': 900,
    'Mysore': 700,
    'Hubli': 600,
    'Belgaum': 800,
    'Gulbarga': 500,
    'Mangalore': 3500,
}

# Load trained model and base crop info
model = joblib.load('kharif_model.pkl')
base = pd.read_csv('kharif_data.csv').groupby('Crop Name').mean().reset_index()

# Helper functions
def get_water_for_region(region):
    return REGION_RAINFALL.get(region, int(np.mean(list(REGION_RAINFALL.values()))))

def predict_for_crop(crop_name, N, P, K, water):
    X = pd.DataFrame([{'Crop Name': crop_name, 'N': N, 'P2O5': P, 'K2O': K, 'Water': water}])
    y_pred = model.predict(X)[0]
    return {'Yield': max(0, y_pred[0]), 'Price': max(0, y_pred[1])}


def simulate_sequence(start_crop, N, P, K, water, area, used_global):
    seq = []
    curr_N, curr_P, curr_K = N, P, K
    used_local = set()
    crop = start_crop

    for year in range(1, 4):
        # Record starting NPK
        fertilizer = {'N': 0, 'P': 0, 'K': 0}
        # If negative, add minimal fertilizer
        for nut, curr in zip(['N','P','K'], [curr_N, curr_P, curr_K]):
            if curr < 0:
                fertilizer[nut] = abs(curr) + 1
                if nut == 'N': curr_N = 1
                if nut == 'P': curr_P = 1
                if nut == 'K': curr_K = 1
        pred = predict_for_crop(crop, curr_N, curr_P, curr_K, water)
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

        used_local.add(crop)
        used_global.add(crop)

        # Choose next: sample from top candidates, exclude used global and local
        candidates = [c for c in base['Crop Name'] if c not in used_global]
        if not candidates:
            break
        # Rank candidates by yield
        ranked = sorted(candidates, key=lambda c: predict_for_crop(c, curr_N, curr_P, curr_K, water)['Yield'], reverse=True)
        # Randomly pick one from top 5 (or fewer)
        top_k = ranked[:5]
        crop = random.choice(top_k)

    return seq


def main():
    random.seed(42)
    N = float(input("Enter soil N (kg/ha): "))
    P = float(input("Enter soil P2O5 (kg/ha): "))
    K = float(input("Enter soil K2O (kg/ha): "))
    region = input("Enter Karnataka region (e.g., Bangalore, Mysore): ")
    area = float(input("Enter land area (ha): "))
    water = get_water_for_region(region)

    # Prepare global used set to ensure unique across all plans
    used_global = set()
    plans = {}

    # Initial candidate list: top 9 ranked by yield
    initial_ranked = sorted(
        list(base['Crop Name']),
        key=lambda c: predict_for_crop(c, N, P, K, water)['Yield'],
        reverse=True
    )[:9]

    # For each of 3 plans, pick a different start from initial_ranked
    for idx in range(3):
        start_crop = initial_ranked[idx]
        plans[f'Plan {idx+1} (Start: {start_crop})'] = simulate_sequence(
            start_crop, N, P, K, water, area, used_global
        )

    # Display
    for name, seq in plans.items():
        print(f"\n{name}")
        for entry in seq:
            print(entry)

if __name__ == "__main__":
    main()
