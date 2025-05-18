import pandas as pd

# Load the CSV file
df = pd.read_csv("crop_yield.csv")  # Replace with your actual file name

# Strip whitespace from column names and string values
df.columns = df.columns.str.strip()
df = df.applymap(lambda x: x.strip() if isinstance(x, str) else x)

# Get unique values for all columns
for column in df.columns:
    unique_vals = df[column].unique()
    print(f"Unique values in '{column}':\n{list(unique_vals)}\n")
