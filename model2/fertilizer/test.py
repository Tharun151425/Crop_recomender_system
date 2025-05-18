import numpy as np
import pandas as pd
import warnings
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from xgboost import XGBClassifier
from sklearn.metrics import classification_report, accuracy_score

# Suppress warnings
warnings.filterwarnings("ignore")

# Load the dataset
df = pd.read_csv("data_core.csv")

# Check for missing values
print(f"Missing Values:\n{df.isnull().sum()}")
print(f"Duplicated Rows: {df.duplicated().sum()}")

# Convert categorical columns to category data type
categorical_columns = ["Soil Type", "Crop Type", "Fertilizer Name"]
for col in categorical_columns:
    df[col] = df[col].astype("category")

# Label Encoding for categorical features
label_encoders = {}
for col in categorical_columns:
    label_encoders[col] = LabelEncoder()
    df[col] = label_encoders[col].fit_transform(df[col])

# Define features (X) and target (y)
X = df.drop(columns=["Fertilizer Name", "Crop Type"])  # Predicting 'Crop Type'
y = df["Crop Type"]

# Split the dataset into training and testing sets (80% training, 20% testing)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Feature Scaling (important for models like XGBoost)
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# Initialize and train the XGBoost classifier
xgb_model = XGBClassifier(use_label_encoder=False, eval_metric="mlogloss")
xgb_model.fit(X_train, y_train)

# Evaluate the model on the test set
y_pred = xgb_model.predict(X_test)
print("Accuracy Score:", accuracy_score(y_test, y_pred))
print("Classification Report:\n", classification_report(y_test, y_pred))

# Save the trained model and the scaler using joblib
joblib.dump(xgb_model, 'xgb_model.pkl')
joblib.dump(scaler, 'scaler.pkl')
joblib.dump(label_encoders, 'label_encoders.pkl')

# Function to predict fertilizer based on user input
def predict_fertilizer():
    print("Please provide the following information to predict the fertilizer.")
    
    soil_type = input("Enter Soil Type (0-3): ")
    crop_type = input("Enter Crop Type (0-3): ")
    
    # Get numerical values for Soil Type and Crop Type
    input_data = np.array([[soil_type, crop_type]])
    
    # Scale the input data (use the same scaler as training)
    input_data = scaler.transform(input_data)
    
    # Predict using the trained XGBoost model
    predicted_crop = xgb_model.predict(input_data)[0]
    
    # Convert the numeric prediction back to its original label using the label encoders
    predicted_crop_name = label_encoders["Crop Type"].inverse_transform([predicted_crop])[0]
    
    print(f"Predicted Crop Type: {predicted_crop_name}")
    
    # Output the fertilizer recommendation (assumed mapping for demonstration purposes)
    fertilizer_map = {
        "Crop A": "Fertilizer A",
        "Crop B": "Fertilizer B",
        "Crop C": "Fertilizer C",
        "Crop D": "Fertilizer D"
    }
    
    # Assuming the crop type directly maps to fertilizer for simplicity
    recommended_fertilizer = fertilizer_map.get(predicted_crop_name, "No Fertilizer Recommendation Available")
    print(f"Recommended Fertilizer: {recommended_fertilizer}")

# Run the function to interact with the user
predict_fertilizer()
