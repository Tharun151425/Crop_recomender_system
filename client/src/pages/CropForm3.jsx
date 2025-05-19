import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CropForm3 = ({ setPredictionResults, setIsLoading }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    region: '',
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
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.region) {
      errors.region = 'Please select a region';
    }
    if (!formData.season) {
      errors.season = 'Please select a season';
    }
    if (!formData.n_value) {
      errors.n_value = 'Please enter Nitrogen value';
    } else if (formData.n_value < 0 || formData.n_value > 500) {
      errors.n_value = 'Nitrogen value should be between 0 and 500';
    }
    if (!formData.p_value) {
      errors.p_value = 'Please enter Phosphorus value';
    } else if (formData.p_value < 0 || formData.p_value > 500) {
      errors.p_value = 'Phosphorus value should be between 0 and 500';
    }
    if (!formData.k_value) {
      errors.k_value = 'Please enter Potassium value';
    } else if (formData.k_value < 0 || formData.k_value > 500) {
      errors.k_value = 'Potassium value should be between 0 and 500';
    }
    if (!formData.area) {
      errors.area = 'Please enter land area';
    } else if (formData.area <= 0) {
      errors.area = 'Area must be greater than 0';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = formData.season.toLowerCase() === 'kharif' 
        ? '/api/predict/kharif' 
        : '/api/predict/rabi';

      console.log('Sending request to:', endpoint);
      console.log('Request payload:', JSON.stringify(formData, null, 2));

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        throw new Error(`Server returned ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Response data:', JSON.stringify(data, null, 2));
      
      if (data.status === 'success') {
        setPredictionResults({
          ...data,
          input: formData
        });
        navigate('/results3');
      } else {
        throw new Error(data.message || 'Prediction failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setFormErrors({
        submit: error.message || 'Network error occurred. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Season-based Crop Recommendation</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2">Region</label>
          <select
            name="region"
            value={formData.region}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Region</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Mysore">Mysore</option>
            <option value="Hubli">Hubli</option>
            <option value="Belgaum">Belgaum</option>
            <option value="Gulbarga">Gulbarga</option>
            <option value="Mangalore">Mangalore</option>
          </select>
          {formErrors.region && <p className="text-red-500 text-sm mt-1">{formErrors.region}</p>}
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
            <option value="Kharif">Kharif</option>
            <option value="Rabi">Rabi</option>
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
            <label className="block mb-2">Phosphorus (P₂O₅)</label>
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
            <label className="block mb-2">Potassium (K₂O)</label>
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

        {formErrors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {formErrors.submit}
          </div>
        )}

        <div className="text-center">
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Get Recommendations
          </button>
        </div>
      </form>
    </div>
  );
};

export default CropForm3;
