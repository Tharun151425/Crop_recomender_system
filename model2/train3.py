import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import pickle

# Load dataset
df = pd.read_csv('data_core.csv')
df.columns = df.columns.str.strip()

# Rename for consistency
df = df.rename(columns={
    'Temparature': 'Temperature',
    'Phosphorous': 'Phosphorus',
    'Soil Type': 'Soil',
    'Crop Type': 'Crop',
    'Fertilizer Name': 'Fertilizer'
})

# Encode categorical columns
le_soil = LabelEncoder()
le_crop = LabelEncoder()
le_fertilizer = LabelEncoder()

df['Soil'] = le_soil.fit_transform(df['Soil'])
df['Crop'] = le_crop.fit_transform(df['Crop'])
df['Fertilizer'] = le_fertilizer.fit_transform(df['Fertilizer'])

# Save encoders
with open('encoders.pkl', 'wb') as f:
    pickle.dump({'soil': le_soil, 'crop': le_crop, 'fertilizer': le_fertilizer}, f)

# Select features and target
features = ['Nitrogen', 'Phosphorus', 'Potassium', 'Temperature', 'Humidity', 'Moisture', 'Soil', 'Crop']
target = 'Fertilizer'

X = df[features]
y = df[target]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestClassifier(n_estimators=150, max_depth=15, random_state=42)
model.fit(X_train, y_train)

# Save model
with open('crop_model2.pkl', 'wb') as f:
    pickle.dump(model, f)

print("✅ Model trained and saved successfully.")
