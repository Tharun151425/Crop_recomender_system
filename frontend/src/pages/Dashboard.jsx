import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import WeatherWidget from '../components/WeatherWidget';
import MarketTrends from '../components/MarketTrends';

const Dashboard = () => {
  // Mock data - replace with Firebase data
  const [activePlan, setActivePlan] = useState({
    id: 'plan-1',
    startDate: '2024-01-01',
    crops: [
      {
        year: 1,
        crop: 'Rice',
        status: 'in-progress',
        progress: 45,
        predictedYield: 52,
        actualYield: 48,
        revenue: 125000,
      },
      {
        year: 2,
        crop: 'Wheat',
        status: 'upcoming',
        progress: 0,
        predictedYield: 45,
        actualYield: null,
        revenue: null,
      },
      {
        year: 3,
        crop: 'Maize',
        status: 'upcoming',
        progress: 0,
        predictedYield: 38,
        actualYield: null,
        revenue: null,
      },
    ],
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Farmer's Dashboard</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Track your crop plans and progress</p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left 2 Columns */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
              >
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Crop</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">Rice</p>
                <div className="mt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Progress</span>
                    <span className="text-gray-900 dark:text-white">45%</span>
                  </div>
                  <div className="mt-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div className="h-2 bg-primary-500 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
              >
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Predicted Yield</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">52 q/ha</p>
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Based on current conditions</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
              >
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Expected Revenue</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">₹125,000</p>
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">At current market prices</p>
              </motion.div>
            </div>

            {/* Timeline */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Crop Timeline</h2>
              <div className="relative">
                {activePlan.crops.map((crop, index) => (
                  <div key={index} className="flex items-start mb-8 last:mb-0">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full ${getStatusColor(crop.status)}`}></div>
                      {index !== activePlan.crops.length - 1 && (
                        <div className="h-full w-0.5 bg-gray-200 dark:bg-gray-700 absolute ml-2" style={{ top: '1rem', bottom: 0 }}></div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{crop.crop}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Year {crop.year}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          crop.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                          crop.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {crop.status === 'in-progress' ? 'In Progress' :
                           crop.status === 'completed' ? 'Completed' : 'Upcoming'}
                        </span>
                      </div>
                      {crop.status !== 'upcoming' && (
                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Predicted Yield</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{crop.predictedYield} q/ha</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Actual Yield</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{crop.actualYield || '-'} q/ha</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Trends */}
            <MarketTrends />
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-8">
            {/* Weather Widget */}
            <WeatherWidget />

            {/* Quick Actions */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-4">
                <Link
                  to="/crop-form"
                  className="block w-full px-4 py-2 text-sm font-medium text-center text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Start New Crop Plan
                </Link>
                <button
                  className="block w-full px-4 py-2 text-sm font-medium text-center text-primary-700 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors dark:bg-primary-900/20 dark:text-primary-400 dark:hover:bg-primary-900/30"
                >
                  Update Current Progress
                </button>
              </div>
            </motion.div>

            {/* Recommendations */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recommendations</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">Consider adding nitrogen fertilizer in the next 2 weeks</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">Soil moisture levels are optimal for current crop stage</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">Weather forecast shows potential rain next week</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 