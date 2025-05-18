# train2.py
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split

# Load data
df = pd.read_csv("sensor_Crop_Dataset(1).csv")

# Drop missing values
df = df.dropna()

# Encode categorical features
le_crop = LabelEncoder()
le_soil = LabelEncoder()
le_var = LabelEncoder()
df['Crop'] = le_crop.fit_transform(df['Crop'])
df['Soil_Type'] = le_soil.fit_transform(df['Soil_Type'])
df['Variety'] = le_var.fit_transform(df['Variety'])

# Features and target
X = df[['Nitrogen', 'Phosphorus', 'Potassium', 'Temperature', 'Humidity', 'pH_Value', 'Rainfall', 'Soil_Type', 'Variety']]
y = df['Crop']

# Train model
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
clf = RandomForestClassifier()
clf.fit(X_train, y_train)

# Save model and encoders
joblib.dump(clf, 'crop_model.pkl')
joblib.dump(le_crop, 'le_crop.pkl')
joblib.dump(le_soil, 'le_soil.pkl')
joblib.dump(le_var, 'le_var.pkl')
