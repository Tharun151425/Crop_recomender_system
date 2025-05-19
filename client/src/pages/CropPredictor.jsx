import { useState } from 'react';
import axios from 'axios';

function parsePlans(raw) {
  if (!raw) return null;
  const plans = raw.split(/\n\s*Plan|^Plan/).filter(Boolean);
  return plans.map((plan) => {
    const lines = plan.trim().split('\n');
    const header = lines[0];
    const entries = lines.slice(1)
      .map(line => {
        try {
          // Replace np.floatXX and single quotes for JSON parsing
          return JSON.parse(line.replace(/np\.float(32|64)\(([^)]+)\)/g, '$2').replace(/'/g, '"'));
        } catch {
          return null;
        }
      })
      .filter(Boolean);
    return { header, entries };
  });
}

const inputLabel = {
  fontWeight: 600,
  marginBottom: 2,
  display: 'block',
};
const inputBox = {
  width: '100%',
  padding: 8,
  marginBottom: 12,
  border: '1px solid #ccc',
  borderRadius: 4,
};
const card = {
  background: '#fff',
  border: '1px solid #eee',
  borderRadius: 8,
  padding: 16,
  marginBottom: 24,
  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
};
const table = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: 8,
};
const th = {
  background: '#f7f7f7',
  fontWeight: 700,
  padding: '6px 10px',
  borderBottom: '1px solid #ddd',
};
const td = {
  padding: '6px 10px',
  borderBottom: '1px solid #f0f0f0',
  fontSize: '0.97rem',
};

const CropPredictor = () => {
  const [form, setForm] = useState({
    n_value: '',
    p_value: '',
    k_value: '',
    region: '',
    area: '',
    season: 'Kharif',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const url = form.season === 'Kharif'
        ? 'http://localhost:5004/api/predict/kharif'
        : 'http://localhost:5004/api/predict/rabi';
      const { data } = await axios.post(url, {
        n_value: form.n_value,
        p_value: form.p_value,
        k_value: form.k_value,
        region: form.region,
        area: form.area,
      });
      setResult(data.output);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const plans = parsePlans(result);

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: 16 }}>
      <h2 style={{ fontWeight: 800, textAlign: 'center', marginBottom: 24 }}>Crop Predictor</h2>
      <form onSubmit={handleSubmit} style={card}>
        <div>
          <label style={inputLabel}>N (kg/ha):</label>
          <input name="n_value" value={form.n_value} onChange={handleChange} required type="number" style={inputBox} />
        </div>
        <div>
          <label style={inputLabel}>P (kg/ha):</label>
          <input name="p_value" value={form.p_value} onChange={handleChange} required type="number" style={inputBox} />
        </div>
        <div>
          <label style={inputLabel}>K (kg/ha):</label>
          <input name="k_value" value={form.k_value} onChange={handleChange} required type="number" style={inputBox} />
        </div>
        <div>
          <label style={inputLabel}>Region:</label>
          <select name="region" value={form.region} onChange={handleChange} required style={inputBox}>
            <option value="">Select</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Mysore">Mysore</option>
            <option value="Hubli">Hubli</option>
            <option value="Belgaum">Belgaum</option>
            <option value="Gulbarga">Gulbarga</option>
            <option value="Mangalore">Mangalore</option>
          </select>
        </div>
        <div>
          <label style={inputLabel}>Area (ha):</label>
          <input name="area" value={form.area} onChange={handleChange} required type="number" min="0.01" step="0.01" style={inputBox} />
        </div>
        <div>
          <label style={inputLabel}>Season:</label>
          <select name="season" value={form.season} onChange={handleChange} required style={inputBox}>
            <option value="Kharif">Kharif</option>
            <option value="Rabi">Rabi</option>
          </select>
        </div>
        <button type="submit" disabled={loading} style={{ ...inputBox, background: '#e0ffe0', color: '#222', fontWeight: 700, cursor: 'pointer', marginBottom: 0 }}>
          {loading ? 'Predicting...' : 'Predict'}
        </button>
      </form>

      {/* User input summary */}
      {result && (
        <div style={card}>
          <h3 style={{ marginBottom: 8, fontWeight: 700 }}>Your Inputs</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            <div>N: <b>{form.n_value}</b></div>
            <div>P: <b>{form.p_value}</b></div>
            <div>K: <b>{form.k_value}</b></div>
            <div>Region: <b>{form.region}</b></div>
            <div>Area: <b>{form.area}</b> ha</div>
            <div>Season: <b>{form.season}</b></div>
          </div>
        </div>
      )}

      {/* Plans display */}
      {plans && plans.map((plan, idx) => (
        <div key={idx} style={card}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>{plan.header}</div>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Year</th>
                <th style={th}>Crop</th>
                <th style={th}>NPK Before</th>
                <th style={th}>Fertilizer Added</th>
                <th style={th}>Predicted Yield</th>
                <th style={th}>Area</th>
                <th style={th}>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {plan.entries.map((entry, i) => (
                <tr key={i}>
                  <td style={td}>{entry['Year']}</td>
                  <td style={td}>{entry['Crop']}</td>
                  <td style={td}>{Array.isArray(entry['NPK Before']) ? entry['NPK Before'].join(', ') : entry['NPK Before']}</td>
                  <td style={td}>{Array.isArray(entry['Fertilizer Added']) ? entry['Fertilizer Added'].join(', ') : entry['Fertilizer Added']}</td>
                  <td style={td}>{entry['Predicted Yield (q/ha)']}</td>
                  <td style={td}>{entry['Area (ha)']}</td>
                  <td style={td}>{entry['Revenue (INR)'] || entry['Revenue (Rs.)'] || entry['Revenue']}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {error && (
        <div style={{ color: '#c0392b', background: '#fff6f6', border: '1px solid #e57373', borderRadius: 6, padding: 12, marginTop: 20, fontWeight: 600 }}>
          <b>Error:</b> {error}
        </div>
      )}
    </div>
  );
};

export default CropPredictor; 