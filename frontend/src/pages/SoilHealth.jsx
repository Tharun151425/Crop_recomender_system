import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const SoilHealth = () => {
  const { isDark } = useTheme();
  const [selectedTab, setSelectedTab] = useState('overview');

  const soilData = {
    overview: {
      health_score: 85,
      last_updated: '2024-03-15',
      status: 'Good',
      recommendations: [
        'Consider adding organic matter to improve soil structure',
        'Monitor pH levels in the northern section',
        'Implement crop rotation to maintain nutrient balance'
      ]
    },
    nutrients: {
      nitrogen: { value: 120, unit: 'kg/ha', status: 'optimal' },
      phosphorus: { value: 45, unit: 'kg/ha', status: 'low' },
      potassium: { value: 180, unit: 'kg/ha', status: 'high' },
      organic_matter: { value: 2.8, unit: '%', status: 'moderate' },
      ph: { value: 6.5, unit: 'pH', status: 'optimal' }
    },
    history: [
      { date: '2024-03-15', health_score: 85, major_changes: 'Added organic compost' },
      { date: '2024-02-15', health_score: 78, major_changes: 'Nitrogen levels improved' },
      { date: '2024-01-15', health_score: 72, major_changes: 'Started pH balancing' }
    ]
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'optimal':
        return 'text-green-500 dark:text-green-400';
      case 'low':
        return 'text-red-500 dark:text-red-400';
      case 'high':
        return 'text-yellow-500 dark:text-yellow-400';
      case 'moderate':
        return 'text-blue-500 dark:text-blue-400';
      default:
        return 'text-gray-500 dark:text-gray-400';
    }
  };

  const tabVariants = {
    active: {
      backgroundColor: isDark ? 'rgb(31, 41, 55)' : 'rgb(255, 255, 255)',
      color: isDark ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    inactive: {
      backgroundColor: 'transparent',
      color: isDark ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)',
      boxShadow: 'none',
    }
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
            Soil Health Monitor
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Track and optimize your soil's health for better crop yields
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8">
          {['overview', 'nutrients', 'history'].map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              variants={tabVariants}
              animate={selectedTab === tab ? 'active' : 'inactive'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 rounded-lg font-medium capitalize"
            >
              {tab}
            </motion.button>
          ))}
        </div>

        {/* Content Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {selectedTab === 'overview' && (
            <>
              {/* Health Score Card */}
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Overall Health Score
                </h3>
                <div className="relative w-48 h-48 mx-auto mb-4">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={isDark ? '#374151' : '#f3f4f6'}
                      strokeWidth="10"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#4ade80"
                      strokeWidth="10"
                      strokeDasharray={`${soilData.overview.health_score * 2.83} 283`}
                      transform="rotate(-90 50 50)"
                    />
                    <text
                      x="50"
                      y="50"
                      textAnchor="middle"
                      dy="0.3em"
                      className="text-3xl font-bold"
                      fill={isDark ? '#ffffff' : '#111827'}
                    >
                      {soilData.overview.health_score}%
                    </text>
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    Last updated: {soilData.overview.last_updated}
                  </p>
                  <p className="text-lg font-semibold text-green-500">
                    Status: {soilData.overview.status}
                  </p>
                </div>
              </motion.div>

              {/* Recommendations */}
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
                className="col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Recommendations
                </h3>
                <div className="space-y-4">
                  {soilData.overview.recommendations.map((rec, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <svg
                        className="w-6 h-6 text-green-500 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </>
          )}

          {selectedTab === 'nutrients' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {Object.entries(soilData.nutrients).map(([nutrient, data], index) => (
                <motion.div
                  key={nutrient}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white capitalize mb-4">
                    {nutrient.replace('_', ' ')}
                  </h3>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {data.value}
                        <span className="text-sm ml-1 text-gray-500">{data.unit}</span>
                      </p>
                      <p className={`mt-2 font-medium capitalize ${getStatusColor(data.status)}`}>
                        {data.status}
                      </p>
                    </div>
                    <div className="w-16 h-16">
                      {/* Add nutrient-specific icons here */}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {selectedTab === 'history' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-3"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Soil Health History
                  </h3>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {soilData.history.map((record, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="px-6 py-4"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {record.date}
                          </p>
                          <p className="mt-1 text-gray-900 dark:text-white">
                            {record.major_changes}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <span className="text-2xl font-bold text-gray-900 dark:text-white">
                            {record.health_score}%
                          </span>
                          <svg
                            className="w-5 h-5 ml-2 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                            />
                          </svg>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SoilHealth; 