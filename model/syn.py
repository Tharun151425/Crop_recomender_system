import pandas as pd
import numpy as np

# 1. Crop lists
crops = ["Rice", "Wheat", "Maize", "Soybean", "Chickpea", "Potato", "Tomato", "Cotton"]
n_crops = len(crops)

# 2. Typical NPK removal rates (kg/ha) per crop at average yield
#    Values from horticultural and pulse guidelines
npk_removal = {
    "Rice":       {"N": 100, "P": 40,  "K": 120},
    "Wheat":      {"N": 80,  "P": 30,  "K": 90},
    "Maize":      {"N": 85,  "P": 25,  "K": 100},
    "Soybean":    {"N": 50,  "P": 20,  "K": 60},
    "Chickpea":   {"N": 60,  "P": 14,  "K": 60},
    "Potato":     {"N": 150, "P": 60,  "K": 200},
    "Tomato":     {"N": 200, "P": 75,  "K": 300},
    "Cotton":     {"N": 120, "P": 40,  "K": 200},
}

# 3. Price per ton USD (approximate global/spot rates)
prices = {
    "Rice":    350,   # USD/ton :contentReference[oaicite:4]{index=4}
    "Wheat":   335,   # USD/ton :contentReference[oaicite:5]{index=5}
    "Maize":   216,   # USD/ton :contentReference[oaicite:6]{index=6}
    "Soybean": 450,   # USD/ton (approx. SOY futures)
    "Chickpea":550,   # USD/ton (pulse premium)
    "Potato":   200,  # USD/ton 
    "Tomato":   400,  # USD/ton (processing grade)
    "Cotton":   1800, # USD/ton lint :contentReference[oaicite:7]{index=7}
}

# 4. Fertilizer unit cost (USD per kg of N+P+K)
fertilizer_cost_per_kg = 0.50

# 5. Generate synthetic rotations
rows = []
for i in range(500):  # generate 500 synthetic entries
    prev = np.random.choice(crops)
    # ensure next crop differs
    nxt_choices = [c for c in crops if c != prev]
    nxt = np.random.choice(nxt_choices)
    
    # Soil nutrient depletion = removal rates of prev crop
    rem = npk_removal[prev]
    # Simulate yield of next crop (t/ha) ~ Normal around global avg
    # Use published global means: Rice ~4.6, Wheat ~3.5, Maize ~5.5, etc.
    yield_means = {"Rice":4.6,"Wheat":3.5,"Maize":5.5,"Soybean":2.8,
                   "Chickpea":1.5,"Potato":20,"Tomato":30,"Cotton":2.2}
    y_mean = yield_means[nxt]
    y_std  = 0.2 * y_mean
    yield_t = max(0.5, np.random.normal(y_mean, y_std))
    
    # Financials
    price = prices[nxt]
    revenue = yield_t * price
    cost = (rem["N"] + rem["P"] + rem["K"]) * fertilizer_cost_per_kg
    profit = revenue - cost
    
    rows.append({
        "previous_crop": prev,
        "next_crop": nxt,
        "N_removed_kg_per_ha": rem["N"],
        "P_removed_kg_per_ha": rem["P"],
        "K_removed_kg_per_ha": rem["K"],
        "expected_yield_t_ha": round(yield_t,2),
        "price_usd_ton": price,
        "revenue_usd": round(revenue,2),
        "fertilizer_cost_usd": round(cost,2),
        "profit_usd": round(profit,2)
    })

# 6. Create DataFrame and save
df = pd.DataFrame(rows)
df.to_csv("synthetic_crop_rotation.csv", index=False)

print("Synthetic dataset saved as 'synthetic_crop_rotation.csv'")
print(df.head())
