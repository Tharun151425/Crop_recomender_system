const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5004;

app.use(cors());
app.use(express.json());

function runPythonScript(scriptRelPath, inputData, res, label) {
  const scriptPath = path.join(__dirname, 'models', scriptRelPath);
  console.log(`[${label}] Starting Python script: ${scriptPath}`);
  const python = spawn('python', [scriptPath], { cwd: path.dirname(scriptPath) });

  let output = '';
  let errorOutput = '';

  python.stdin.write(`${inputData.n_value}\n`);
  python.stdin.write(`${inputData.p_value}\n`);
  python.stdin.write(`${inputData.k_value}\n`);
  python.stdin.write(`${inputData.region}\n`);
  python.stdin.write(`${inputData.area}\n`);
  python.stdin.end();

  python.stdout.on('data', (data) => {
    const str = data.toString();
    console.log(`[${label}] Output:`, str);
    output += str;
  });

  python.stderr.on('data', (data) => {
    const str = data.toString();
    console.error(`[${label}] Error:`, str);
    errorOutput += str;
  });

  python.on('close', (code) => {
    console.log(`[${label}] Python process exited with code:`, code);
    if (code === 0) {
      console.log(`[${label}] Final output:`, output);
      res.status(200).json({ status: 'success', output });
    } else {
      console.error(`[${label}] Error output:`, errorOutput);
      res.status(500).json({ status: 'error', error: errorOutput || 'Unknown error', code });
    }
  });

  python.on('error', (err) => {
    console.error(`[${label}] Failed to start Python process:`, err);
    res.status(500).json({ status: 'error', error: err.message });
  });
}

app.post('/api/predict/kharif', (req, res) => {
  console.log('[Kharif] Received request:', req.body);
  runPythonScript('kharif_model/predict_kharif.py', req.body, res, 'Kharif');
});

app.post('/api/predict/rabi', (req, res) => {
  console.log('[Rabi] Received request:', req.body);
  runPythonScript('rabi_model/predict_rabi.py', req.body, res, 'Rabi');
});

app.listen(PORT, () => {
  console.log(`server4.js running on port ${PORT}`);
}); 