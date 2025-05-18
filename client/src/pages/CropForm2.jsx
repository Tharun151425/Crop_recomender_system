import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CropForm2 = ({ setPredictionResults, setIsLoading }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    location: '',
    season: '',
    area: '',
    n_value: '',
    p_value: '',
    k_value: ''
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.location) errors.location = "Location is required";
    if (!formData.season) errors.season = "Season is required";
    
    if (!formData.n_value) {
      errors.n_value = "Nitrogen value is required";
    } else if (isNaN(formData.n_value) || parseFloat(formData.n_value) < 0) {
      errors.n_value = "Please enter a valid positive number";
    }
    
    if (!formData.p_value) {
      errors.p_value = "Phosphorus value is required";
    } else if (isNaN(formData.p_value) || parseFloat(formData.p_value) < 0) {
      errors.p_value = "Please enter a valid positive number";
    }
    
    if (!formData.k_value) {
      errors.k_value = "Potassium value is required";
    } else if (isNaN(formData.k_value) || parseFloat(formData.k_value) < 0) {
      errors.k_value = "Please enter a valid positive number";
    }
    
    if (!formData.area) {
      errors.area = "Land area is required";
    } else if (isNaN(formData.area) || parseFloat(formData.area) <= 0) {
      errors.area = "Please enter a valid positive number";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:5001/api/smart-predict', formData);
      setPredictionResults(response.data);
      navigate('/results2');
    } catch (error) {
      console.error('Error making prediction:', error.response?.data || error.message);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Smart Crop Recommendation</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2">Location (State)</label>
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select State</option>
            <option value="Assam">Assam</option>
            <option value="Bihar">Bihar</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Kerala">Kerala</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Punjab">Punjab</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="West Bengal">West Bengal</option>
          </select>
          {formErrors.location && <p className="text-red-500 text-sm mt-1">{formErrors.location}</p>}
        </div>

        <div>
          <label className="block mb-2">Season</label>
          <select
            name="season"
            value={formData.season}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Season</option>
            <option value="Summer">Summer</option>
            <option value="Winter">Winter</option>
            <option value="Kharif">Kharif</option>
            <option value="Rabi">Rabi</option>
            <option value="Whole Year">Whole Year</option>
          </select>
          {formErrors.season && <p className="text-red-500 text-sm mt-1">{formErrors.season}</p>}
        </div>

        <div>
          <label className="block mb-2">Land Area (hectares)</label>
          <input
            type="number"
            name="area"
            value={formData.area}
            onChange={handleChange}
            placeholder="e.g., 2.5"
            className="w-full p-2 border rounded"
          />
          {formErrors.area && <p className="text-red-500 text-sm mt-1">{formErrors.area}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2">Nitrogen (N)</label>
            <input
              type="number"
              name="n_value"
              value={formData.n_value}
              onChange={handleChange}
              placeholder="e.g., 80"
              className="w-full p-2 border rounded"
            />
            {formErrors.n_value && <p className="text-red-500 text-sm mt-1">{formErrors.n_value}</p>}
          </div>

          <div>
            <label className="block mb-2">Phosphorus (P)</label>
            <input
              type="number"
              name="p_value"
              value={formData.p_value}
              onChange={handleChange}
              placeholder="e.g., 40"
              className="w-full p-2 border rounded"
            />
            {formErrors.p_value && <p className="text-red-500 text-sm mt-1">{formErrors.p_value}</p>}
          </div>

          <div>
            <label className="block mb-2">Potassium (K)</label>
            <input
              type="number"
              name="k_value"
              value={formData.k_value}
              onChange={handleChange}
              placeholder="e.g., 60"
              className="w-full p-2 border rounded"
            />
            {formErrors.k_value && <p className="text-red-500 text-sm mt-1">{formErrors.k_value}</p>}
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Get Smart Recommendations
          </button>
        </div>
      </form>
    </div>
  );
};

export default CropForm2;
