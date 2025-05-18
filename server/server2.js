const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/dist')));

// Endpoint to make predictions with smart model
app.post('/api/smart-predict', (req, res) => {
  console.log('Making smart prediction with input:', req.body);
  
  const predictScript = path.join(__dirname, 'models', 'smart_predict.py');
  
  // Check if script exists
  if (!fs.existsSync(predictScript)) {
    return res.status(404).json({ 
      status: 'error', 
      message: 'Prediction script not found' 
    });
  }
  
  // Check if model exists
  const modelPath = path.join(__dirname, 'models', 'smart_crop_model.pkl');
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
        console.log('Smart prediction response:', predictions);
        
        if (predictions.success === false) {
          return res.status(500).json({
            status: 'error',
            message: predictions.error || 'Prediction failed'
          });
        }

        res.json({
          status: 'success',
          ...predictions
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

// Train model endpoint
app.post('/api/train-smart-model', (req, res) => {
  console.log('Training smart model...');
  
  const trainScript = path.join(__dirname, 'models', 'smart_crop_recommender.py');
  
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
    if (code === 0) {
      res.json({ 
        status: 'success', 
        message: 'Model trained successfully', 
        output 
      });
    } else {
      res.status(500).json({ 
        status: 'error', 
        message: 'Error training model', 
        error: errorOutput 
      });
    }
  });
});

// Fallback handler for all other routes - serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Smart Crop Server is running on port ${PORT}`);
});
