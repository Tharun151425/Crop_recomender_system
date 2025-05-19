const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');

// Environment variables with defaults
const PORT = process.env.PORT || 5002;
const NODE_ENV = process.env.NODE_ENV || 'development';
const MAX_REQUESTS_PER_IP = process.env.MAX_REQUESTS_PER_IP || 100;
const RATE_LIMIT_WINDOW_MS = process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000; // 15 minutes

const app = express();

// Configure rate limiting
const limiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: MAX_REQUESTS_PER_IP,
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again later.'
  }
});

// Middleware
app.use(cors({
  origin: NODE_ENV === 'development' ? '*' : ['http://localhost:5173', 'https://your-production-domain.com'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use(morgan('dev'));
app.use(limiter);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/dist')));

// Input validation middleware
const validateCropInput = (req, res, next) => {
  const { n_value, p_value, k_value, region, area } = req.body;
  const errors = [];

  // Validate numeric values
  if (!n_value || isNaN(n_value) || n_value < 0 || n_value > 500) {
    errors.push('Nitrogen value must be between 0 and 500');
  }
  if (!p_value || isNaN(p_value) || p_value < 0 || p_value > 500) {
    errors.push('Phosphorus value must be between 0 and 500');
  }
  if (!k_value || isNaN(k_value) || k_value < 0 || k_value > 500) {
    errors.push('Potassium value must be between 0 and 500');
  }
  if (!area || isNaN(area) || area <= 0) {
    errors.push('Area must be greater than 0');
  }

  // Validate region
  const validRegions = ['Bangalore', 'Mysore', 'Hubli', 'Belgaum', 'Gulbarga', 'Mangalore'];
  if (!region || !validRegions.includes(region)) {
    errors.push(`Region must be one of: ${validRegions.join(', ')}`);
  }

  if (errors.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors
    });
  }

  next();
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV
  });
});

// Helper function to run Python prediction script
const runPrediction = (scriptName, inputData) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, 'models', scriptName);
    
    if (!fs.existsSync(scriptPath)) {
      reject(new Error(`Prediction script not found: ${scriptPath}`));
      return;
    }

    // Change working directory to the script's directory so it can find its dependencies
    const scriptDir = path.dirname(scriptPath);
    const python = spawn('python', [scriptPath], {
      cwd: scriptDir
    });
    let output = '';
    let errorOutput = '';

    // Send input data to Python script
    python.stdin.write(`${Number(inputData.n_value)}\n`);
    python.stdin.write(`${Number(inputData.p_value)}\n`);
    python.stdin.write(`${Number(inputData.k_value)}\n`);
    python.stdin.write(`${inputData.region}\n`);
    python.stdin.write(`${Number(inputData.area)}\n`);
    python.stdin.end();

    python.stdout.on('data', (data) => {
      const str = data.toString();
      console.log('Received output:', str);
      output += str;
    });

    python.stderr.on('data', (data) => {
      const str = data.toString();
      console.error('Received error:', str);
      errorOutput += str;
    });

    python.on('close', (code) => {
      console.log('Python process output:', output);
      console.log('Python process error output:', errorOutput);
      
      if (code === 0) {
        // Parse the output into a structured format
        try {
          if (!output.trim()) {
            reject(new Error('No output received from prediction script'));
            return;
          }

          const plans = output.split('\n\nPlan').filter(Boolean);
          if (plans.length === 0) {
            reject(new Error('No plans found in prediction output'));
            return;
          }

          const structuredPlans = plans.map(plan => {
            try {
              const [planHeader, ...planData] = plan.split('\n');
              const planNumberMatch = planHeader.match(/\d+/);
              const startCropMatch = planHeader.match(/Start: (.*?)\)/);
              
              if (!planNumberMatch || !startCropMatch) {
                throw new Error(`Invalid plan header format: ${planHeader}`);
              }

              const planNumber = planNumberMatch[0];
              const startCrop = startCropMatch[1];
              
              const predictions = planData
                .filter(line => line.trim().startsWith('{'))
                .map(line => {
                  // Convert string representation of numpy values to regular numbers
                  const cleanLine = line.replace(/np\.float(32|64)\(([\d.]+)\)/g, '$2');
                  try {
                    return JSON.parse(cleanLine);
                  } catch (err) {
                    console.error('Failed to parse prediction line:', line);
                    throw err;
                  }
                });

              if (predictions.length === 0) {
                throw new Error('No valid predictions found in plan');
              }

              return {
                planNumber,
                startCrop,
                predictions
              };
            } catch (err) {
              console.error('Error processing plan:', plan);
              throw err;
            }
          });

          resolve({
            status: 'success',
            plans: structuredPlans
          });
        } catch (error) {
          console.error('Error parsing prediction output:', error);
          console.error('Raw output:', output);
          reject(new Error(`Error parsing prediction output: ${error.message}`));
        }
      } else {
        console.error('Python process failed with code:', code);
        console.error('Error output:', errorOutput);
        reject(new Error(`Prediction process failed: ${errorOutput || 'Unknown error'}`));
      }
    });

    python.on('error', (error) => {
      reject(new Error(`Failed to start prediction process: ${error.message}`));
    });
  });
};

// Kharif prediction endpoint
app.post('/api/predict/kharif', validateCropInput, async (req, res) => {
  try {
    console.log('Received Kharif prediction request:', req.body);
    
    const result = await runPrediction('kharif_model/predict_kharif.py', req.body);
    console.log('Kharif prediction success - Status 200');
    console.log('Response payload:', JSON.stringify(result, null, 2));
    res.status(200).json(result);
  } catch (error) {
    console.error('Kharif prediction error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      status: 'error',
      message: NODE_ENV === 'development' ? error.message : 'Internal server error',
      stack: NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Rabi prediction endpoint
app.post('/api/predict/rabi', validateCropInput, async (req, res) => {
  try {
    console.log('Received Rabi prediction request:', req.body);
    
    const result = await runPrediction('rabi_model/predict_rabi.py', req.body);
    console.log('Rabi prediction success - Status 200');
    console.log('Response payload:', JSON.stringify(result, null, 2));
    res.status(200).json(result);
  } catch (error) {
    console.error('Rabi prediction error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      status: 'error',
      message: NODE_ENV === 'development' ? error.message : 'Internal server error',
      stack: NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    status: 'error',
    message: NODE_ENV === 'development' ? err.message : 'Internal server error',
    stack: NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Fallback handler for all other routes - serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Season-based Crop Server is running on port ${PORT} in ${NODE_ENV} mode`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
