import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const CropForm = ({ setPredictionResults, setIsLoading }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    previous_crop: '',
    location: '',
    n_value: '',
    p_value: '',
    k_value: '',
    area: '',
    season: ''
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.previous_crop) errors.previous_crop = "Previous crop is required";
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
    console.log('Form submitted with data:', formData);
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }
    
    try {
      setIsLoading(true);
      console.log('Sending request to backend...');
      
      // Send data to backend
      const response = await axios.post('http://localhost:5000/api/predict', formData);
      console.log('Received response:', response.data);
      
      // Store results and navigate to results page
      setPredictionResults(response.data);
      navigate('/results');
    } catch (error) {
      console.error('Error making prediction:', error.response?.data || error.message);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-12 bg-gradient-to-b from-primary-100/30 to-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-extrabold text-primary-500 sm:text-4xl">
            Crop Recommendation System
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Enter your farm details to get personalized crop recommendations
          </p>
        </motion.div>

        <motion.div
          className="bg-white p-8 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="previous_crop" className="form-label">Previous Crop</label>
                <select
                  id="previous_crop"
                  name="previous_crop"
                  value={formData.previous_crop}
                  onChange={handleChange}
                  className={`form-select ${formErrors.previous_crop ? 'border-red-500' : ''}`}
                >
                  <option value="">Select Previous Crop</option>
                  <option value="Rice">Rice</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Maize">Maize</option>
                  <option value="Potato">Potato</option>
                  <option value="Sugarcane">Sugarcane</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Groundnut">Groundnut</option>
                  <option value="None">None (First Crop)</option>
                </select>
                {formErrors.previous_crop && <p className="text-red-500 text-sm mt-1">{formErrors.previous_crop}</p>}
              </div>

              <div>
                <label htmlFor="location" className="form-label">Location (State)</label>
                <select
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`form-select ${formErrors.location ? 'border-red-500' : ''}`}
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
                <label htmlFor="season" className="form-label">Season</label>
                <select
                  id="season"
                  name="season"
                  value={formData.season}
                  onChange={handleChange}
                  className={`form-select ${formErrors.season ? 'border-red-500' : ''}`}
                >
                  <option value="">Select Season</option>
                  <option value="Kharif">Kharif (Monsoon)</option>
                  <option value="Rabi">Rabi (Winter)</option>
                  <option value="Summer">Summer</option>
                  <option value="Whole Year">Whole Year</option>
                </select>
                {formErrors.season && <p className="text-red-500 text-sm mt-1">{formErrors.season}</p>}
              </div>

              <div>
                <label htmlFor="area" className="form-label">Land Area (hectares)</label>
                <input
                  type="number"
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="e.g., 5.0"
                  min="0.1"
                  step="0.1"
                  className={`form-input ${formErrors.area ? 'border-red-500' : ''}`}
                />
                {formErrors.area && <p className="text-red-500 text-sm mt-1">{formErrors.area}</p>}
              </div>
              
              <div className="md:col-span-2">
                <h3 className="text-lg font-medium text-primary-400 mb-2">Soil NPK Values</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label htmlFor="n_value" className="form-label">Nitrogen (N)</label>
                    <input
                      type="number"
                      id="n_value"
                      name="n_value"
                      value={formData.n_value}
                      onChange={handleChange}
                      placeholder="e.g., 80"
                      min="0"
                      step="1"
                      className={`form-input ${formErrors.n_value ? 'border-red-500' : ''}`}
                    />
                    {formErrors.n_value && <p className="text-red-500 text-sm mt-1">{formErrors.n_value}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="p_value" className="form-label">Phosphorus (P)</label>
                    <input
                      type="number"
                      id="p_value"
                      name="p_value"
                      value={formData.p_value}
                      onChange={handleChange}
                      placeholder="e.g., 40"
                      min="0"
                      step="1"
                      className={`form-input ${formErrors.p_value ? 'border-red-500' : ''}`}
                    />
                    {formErrors.p_value && <p className="text-red-500 text-sm mt-1">{formErrors.p_value}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="k_value" className="form-label">Potassium (K)</label>
                    <input
                      type="number"
                      id="k_value"
                      name="k_value"
                      value={formData.k_value}
                      onChange={handleChange}
                      placeholder="e.g., 60"
                      min="0"
                      step="1"
                      className={`form-input ${formErrors.k_value ? 'border-red-500' : ''}`}
                    />
                    {formErrors.k_value && <p className="text-red-500 text-sm mt-1">{formErrors.k_value}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <motion.button
                type="submit"
                className="btn btn-primary px-8 py-3 text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Recommendations
              </motion.button>
            </div>
          </form>
        </motion.div>
        
        <motion.div 
          className="mt-8 bg-primary-100 p-6 rounded-lg shadow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-lg font-medium text-primary-500 mb-2">Tips for accurate results:</h3>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>Make sure to enter the most recent NPK test values for your soil</li>
            <li>Land area should be in hectares (1 acre ≈ 0.4 hectares)</li>
            <li>The previous crop helps our model factor in soil nutrient depletion</li>
            <li>Select the season when you're planning to plant the next crop</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default CropForm; 