import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const CropPredictor = () => {
  const { isDark } = useTheme();
  const [form, setForm] = useState({
    n_value: '',
    p_value: '',
    k_value: '',
    region: '',
    area: '',
    season: 'Kharif',
  });
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPlans(null);
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
      setPlans(data.plans);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatFertilizer = (fert) => {
    if (!Array.isArray(fert)) return '-';
    if (fert.every(v => Number(v) === 0)) return '-';
    const labels = ['N', 'P', 'K'];
    return fert.map((v, i) => v > 0 ? `${labels[i]}: ${Number(v).toFixed(2)}` : null).filter(Boolean).join(', ');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-leaf-50 to-white dark:from-gray-900 dark:to-gray-800"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Crop Predictor
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Get intelligent crop recommendations based on your soil conditions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 lg:p-8"
          >
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Soil Parameters
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nitrogen (N) kg/ha
                  </label>
                  <input
                    type="number"
                    name="n_value"
                    value={form.n_value}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-leaf-500 focus:border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phosphorus (P) kg/ha
                  </label>
                  <input
                    type="number"
                    name="p_value"
                    value={form.p_value}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-leaf-500 focus:border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Potassium (K) kg/ha
                  </label>
                  <input
                    type="number"
                    name="k_value"
                    value={form.k_value}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-leaf-500 focus:border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Area (ha)
                  </label>
                  <input
                    type="number"
                    name="area"
                    value={form.area}
                    onChange={handleChange}
                    required
                    min="0.01"
                    step="0.01"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-leaf-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Region
                  </label>
                  <select
                    name="region"
                    value={form.region}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-leaf-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select Region</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Mysore">Mysore</option>
                    <option value="Hubli">Hubli</option>
                    <option value="Belgaum">Belgaum</option>
                    <option value="Gulbarga">Gulbarga</option>
                    <option value="Mangalore">Mangalore</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Season
                  </label>
                  <select
                    name="season"
                    value={form.season}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-leaf-500 focus:border-transparent transition-colors"
                  >
                    <option value="Kharif">Kharif</option>
                    <option value="Rabi">Rabi</option>
                  </select>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-leaf-500 to-leaf-600 text-white font-semibold shadow-lg hover:from-leaf-600 hover:to-leaf-700 focus:outline-none focus:ring-2 focus:ring-leaf-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Predicting...
                  </div>
                ) : (
                  'Get Predictions'
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                      Error
                    </h3>
                    <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                      {error}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {plans && (
              <div className="space-y-6">
                {/* Input Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Your Inputs
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Nitrogen</div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">{form.n_value}</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Phosphorus</div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">{form.p_value}</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Potassium</div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">{form.k_value}</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Region</div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">{form.region}</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Area</div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">{form.area} ha</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Season</div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">{form.season}</div>
                    </div>
                  </div>
                </motion.div>

                {/* Plans */}
                {plans.map((plan, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
                  >
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {plan.header}
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900/50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Year</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Crop</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">NPK Before</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fertilizer Added</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Predicted Yield</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Area</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Revenue</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {plan.entries.map((entry, i) => (
                            <motion.tr
                              key={i}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{entry['Year']}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-leaf-600 dark:text-leaf-400">{entry['Crop']}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{Array.isArray(entry['NPK Before']) ? entry['NPK Before'].join(', ') : entry['NPK Before']}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatFertilizer(entry['Fertilizer Added'])}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{entry['Predicted Yield (q/ha)']}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{entry['Area (ha)']}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 dark:text-green-400">{entry['Revenue (INR)'] || entry['Revenue (Rs.)'] || entry['Revenue']}</td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CropPredictor; 