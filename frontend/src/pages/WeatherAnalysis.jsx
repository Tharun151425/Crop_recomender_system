import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const WeatherAnalysis = () => {
  const { isDark } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState('daily');

  const weatherData = {
    current: {
      temperature: 28,
      humidity: 65,
      wind_speed: 12,
      precipitation: 0,
      condition: 'Clear',
      uv_index: 6,
    },
    daily_forecast: [
      { day: 'Today', temp_high: 28, temp_low: 18, condition: 'Clear', precipitation: 0 },
      { day: 'Tomorrow', temp_high: 27, temp_low: 17, condition: 'Partly Cloudy', precipitation: 20 },
      { day: 'Wed', temp_high: 29, temp_low: 19, condition: 'Rain', precipitation: 60 },
      { day: 'Thu', temp_high: 26, temp_low: 16, condition: 'Rain', precipitation: 80 },
      { day: 'Fri', temp_high: 25, temp_low: 15, condition: 'Cloudy', precipitation: 30 },
    ],
    crop_impact: {
      risk_level: 'Moderate',
      recommendations: [
        'Consider irrigation in the next 48 hours',
        'Monitor disease risk due to high humidity',
        'Plan harvesting before Thursday\'s rain',
      ],
      alerts: [
        { type: 'Rain Alert', message: 'Heavy rain expected on Thursday', severity: 'high' },
        { type: 'Temperature Alert', message: 'Temperature drop expected', severity: 'medium' },
      ],
    },
    seasonal_outlook: {
      trend: 'Above average rainfall expected',
      confidence: 'High',
      key_points: [
        'Higher than normal precipitation',
        'Temperatures within normal range',
        'Increased humidity levels',
      ],
    },
  };

  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return '☀️';
      case 'partly cloudy':
        return '🌤️';
      case 'cloudy':
        return '☁️';
      case 'rain':
        return '🌧️';
      default:
        return '☀️';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
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
            Weather Analysis
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Smart weather insights for optimal farming decisions
          </p>
        </motion.div>

        {/* Current Weather */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Temperature</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{weatherData.current.temperature}°C</p>
              </div>
              <span className="text-4xl">🌡️</span>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Humidity</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{weatherData.current.humidity}%</p>
              </div>
              <span className="text-4xl">💧</span>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Wind Speed</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{weatherData.current.wind_speed} km/h</p>
              </div>
              <span className="text-4xl">🌪️</span>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">UV Index</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{weatherData.current.uv_index}</p>
              </div>
              <span className="text-4xl">☀️</span>
            </div>
          </div>
        </motion.div>

        {/* 5-Day Forecast */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">5-Day Forecast</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {weatherData.daily_forecast.map((day, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
              >
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{day.day}</p>
                <div className="text-3xl my-2">{getWeatherIcon(day.condition)}</div>
                <div className="flex justify-center items-center space-x-2 text-sm">
                  <span className="font-medium text-gray-900 dark:text-white">{day.temp_high}°</span>
                  <span className="text-gray-500 dark:text-gray-400">{day.temp_low}°</span>
                </div>
                <div className="mt-2 text-sm text-blue-500 dark:text-blue-400">
                  {day.precipitation}% 💧
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Crop Impact & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Crop Impact</h2>
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-yellow-800 dark:text-yellow-400 font-medium">
                  Risk Level: {weatherData.crop_impact.risk_level}
                </p>
              </div>
              {weatherData.crop_impact.recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <svg className="w-6 h-6 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Weather Alerts</h2>
            <div className="space-y-4">
              {weatherData.crop_impact.alerts.map((alert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg ${getSeverityColor(alert.severity)}`}
                >
                  <h3 className="font-medium mb-1">{alert.type}</h3>
                  <p className="text-sm">{alert.message}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherAnalysis; 