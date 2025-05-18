# CropSmart: Intelligent Crop Recommendation System

CropSmart is a web application that helps farmers make optimal crop selection decisions using machine learning. The system provides personalized crop recommendations based on soil conditions, location, and other parameters, along with 5-year forecasts of yield, profit, and soil health.

## Features

- Machine learning-based crop recommendations
- 5-year forecasts for selected crops
- Visualization of yield, profit, and soil nutrient levels
- Responsive and intuitive user interface
- Interactive data visualizations

## Tech Stack

### Frontend
- React with Vite
- Tailwind CSS for styling
- Framer Motion for animations
- Chart.js for data visualization
- React Router for navigation

### Backend
- Express.js
- Python (scikit-learn) for machine learning
- Gradient Boosting Regressor model

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/                # Source code
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   └── App.jsx         # Main application component
│   └── ...
│
├── server/                 # Backend Express.js server
│   ├── data/               # CSV and synthetic datasets
│   ├── models/             # Python ML scripts and models
│   └── server.js           # Express server entry point
│
└── README.md               # Project documentation
```

## Prerequisites

- Node.js (v14+)
- Python (v3.8+)
- Required Python packages:
  - pandas
  - numpy
  - scikit-learn
  - joblib

## Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cropsmart.git
   cd cropsmart
   ```

2. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../client
   npm install
   ```

4. Install required Python packages:
   ```bash
   pip install pandas numpy scikit-learn joblib
   ```

### Running the Application

1. Train the ML model (first time only):
   ```bash
   cd server
   python models/train_model.py
   ```

2. Start the backend server:
   ```bash
   cd server
   npm run dev
   ```

3. In a new terminal, start the frontend development server:
   ```bash
   cd client
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` to use the application.

## Usage

1. Navigate to the Crop Prediction page
2. Enter your farm details:
   - Previous crop
   - Location (state)
   - Season
   - Land area
   - Soil NPK values
3. Click "Get Recommendations"
4. View the results and 5-year forecasts for recommended crops

## License

MIT

## Acknowledgements

This project uses the crop yield dataset to train the machine learning model. Special thanks to all the libraries and frameworks that made this project possible. 