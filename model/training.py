import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.preprocessing import OneHotEncoder

# 1. Load CSV
data = pd.read_csv("crop_yield.csv")

# 2. Synthetic Data Augmentation
def augment_synthetic(df, factor=2, noise_level=0.05):
    synthetic = []
    numeric_cols = ['Crop_Year', 'Area', 'Production', 'Annual_Rainfall', 'Fertilizer', 'Pesticide']
    for _ in range(factor):
        noisy = df.copy()
        for col in numeric_cols:
            noisy[col] *= (1 + np.random.normal(0, noise_level, size=len(df)))
        synthetic.append(noisy)
    return pd.concat([df] + synthetic, ignore_index=True)

data_aug = augment_synthetic(data, factor=2, noise_level=0.05)

# 3. Encode Crop
ohe = OneHotEncoder(sparse_output=False)
crop_encoded = ohe.fit_transform(data_aug[['Crop']])
crop_cols = ohe.get_feature_names_out(['Crop'])

# 4. Prepare data
features = ['Crop_Year', 'Area', 'Production', 'Annual_Rainfall', 'Fertilizer', 'Pesticide']
X = pd.concat([data_aug[features], pd.DataFrame(crop_encoded, columns=crop_cols)], axis=1)
y = data_aug['Yield']

# 5. Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 6. Model training (100 epochs/trees)
model = GradientBoostingRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 7. Model evaluation
y_pred = model.predict(X_test)
print("📊 Model Performance:")
print(f"Mean Squared Error (MSE): {mean_squared_error(y_test, y_pred):.2f}")
print(f"Mean Absolute Error (MAE): {mean_absolute_error(y_test, y_pred):.2f}")
print(f"R² Score: {r2_score(y_test, y_pred):.4f}")

# 8. Predict top 5 crops
def top5_crops(input_dict):
    crops = ohe.categories_[0]
    rows = []
    for crop in crops:
        row = input_dict.copy()
        row['Crop'] = crop
        rows.append(row)
    df_input = pd.DataFrame(rows)
    crop_enc = ohe.transform(df_input[['Crop']])
    X_user = pd.concat([df_input[features], pd.DataFrame(crop_enc, columns=crop_cols)], axis=1)
    df_input['Predicted_Yield'] = model.predict(X_user)
    return df_input.sort_values('Predicted_Yield', ascending=False).head(25)

# 9. Example user input
user_input = {
    'Crop_Year': 2025,
    'Area': 1000,
    'Production': 5000,
    'Annual_Rainfall': 1500,
    'Fertilizer': 20000,
    'Pesticide': 500
}

# 10. Show output
print("\n🌾 Top 5 Recommended Crops for Input:")
result = top5_crops(user_input)
print(result[['Crop', 'Predicted_Yield']].to_string(index=False))
