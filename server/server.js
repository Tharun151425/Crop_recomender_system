const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/dist')));

// Check if Python is installed
app.get('/api/check-setup', (req, res) => {
  const python = spawn('python', ['--version']);
  
  python.stdout.on('data', (data) => {
    res.json({ 
      status: 'success', 
      message: `Python is installed: ${data.toString().trim()}` 
    });
  });
  
  python.stderr.on('data', (data) => {
    res.status(500).json({ 
      status: 'error', 
      message: `Error checking Python installation: ${data.toString().trim()}` 
    });
  });
  
  python.on('error', (error) => {
    res.status(500).json({ 
      status: 'error', 
      message: 'Python is not installed or not in PATH' 
    });
  });
});

// Endpoint to train the model
app.post('/api/train-model', (req, res) => {
  console.log('Training model...');
  
  const trainScript = path.join(__dirname, 'models', 'train_model.py');
  
  // Check if script exists
  if (!fs.existsSync(trainScript)) {
    return res.status(404).json({ 
      status: 'error', 
      message: 'Training script not found' 
    });
  }
  
  const python = spawn('python', [trainScript]);
  
  let output = '';
  let errorOutput = '';
  
  python.stdout.on('data', (data) => {
    const stdout = data.toString();
    console.log(`Training stdout: ${stdout}`);
    output += stdout;
  });
  
  python.stderr.on('data', (data) => {
    const stderr = data.toString();
    console.error(`Training stderr: ${stderr}`);
    errorOutput += stderr;
  });
  
  python.on('close', (code) => {
    console.log(`Training process exited with code ${code}`);
    
    if (code === 0) {
      console.log('Train model success response:', output); // <-- Log here
      res.json({ 
        status: 'success', 
        message: 'Model trained successfully', 
        output 
      });
    } else {
      console.log('Train model error response:', errorOutput); // <-- Log here
      res.status(500).json({ 
        status: 'error', 
        message: 'Error training model', 
        error: errorOutput 
      });
    }
  });
  
  python.on('error', (error) => {
    console.error(`Failed to start training process: ${error.message}`);
    res.status(500).json({ 
      status: 'error', 
      message: `Failed to start training process: ${error.message}` 
    });
  });
});

// Endpoint to make predictions
app.post('/api/predict', (req, res) => {
  console.log('Making prediction with input:', req.body);
  
  const predictScript = path.join(__dirname, 'models', 'predict_crop.py');
  
  // Check if script exists
  if (!fs.existsSync(predictScript)) {
    return res.status(404).json({ 
      status: 'error', 
      message: 'Prediction script not found' 
    });
  }
  
  // Check if model exists
  const modelPath = path.join(__dirname, 'models', 'crop_yield_model.pkl');
  if (!fs.existsSync(modelPath)) {
    return res.status(404).json({ 
      status: 'error', 
      message: 'Model not found. Please train the model first.' 
    });
  }
    console.log('Spawning Python process with input:', JSON.stringify(req.body));
  const python = spawn('python', [predictScript, JSON.stringify(req.body)]);
  
  let output = '';
  let errorOutput = '';
  
  python.stdout.on('data', (data) => {
    const stdout = data.toString();
    console.log('Python stdout:', stdout);
    output += stdout;
  });
  
  python.stderr.on('data', (data) => {
    const stderr = data.toString();
    console.error('Python stderr:', stderr);
    errorOutput += stderr;
  });
  
  python.on('close', (code) => {
    console.log(`Prediction process exited with code ${code}`);
      if (code === 0) {
      try {
        const predictions = JSON.parse(output);
        console.log('Prediction JSON response:', predictions);
        
        if (predictions.success === false) {
          return res.status(500).json({
            status: 'error',
            message: predictions.error || 'Prediction failed'
          });
        }

        // If we have recommendations, format them
        if (predictions.recommendations) {
          console.log('Top 5 recommended crops:', predictions.recommendations);
          return res.json({
            status: 'success',
            recommendations: predictions.recommendations
          });
        }

        // Single crop prediction
        res.json({
          status: 'success',
          prediction: predictions
        });
      } catch (error) {
        console.error('Error parsing prediction output:', error);
        res.status(500).json({ 
          status: 'error', 
          message: 'Error parsing prediction output', 
          error: error.message,
          rawOutput: output 
        });
      }
    } else {
      res.status(500).json({ 
        status: 'error', 
        message: 'Error making prediction', 
        error: errorOutput 
      });
    }
  });
  
  python.on('error', (error) => {
    console.error(`Failed to start prediction process: ${error.message}`);
    res.status(500).json({ 
      status: 'error', 
      message: `Failed to start prediction process: ${error.message}` 
    });
  });
});

// Fallback handler for all other routes - serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});