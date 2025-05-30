import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock weather data - replace with actual API call
    setTimeout(() => {
      setWeather({
        temperature: 28,
        humidity: 65,
        rainfall: 2.5,
        forecast: [
          { day: 'Today', temp: 28, icon: '☀️' },
          { day: 'Tomorrow', temp: 27, icon: '🌤️' },
          { day: 'Wed', temp: 29, icon: '⛈️' },
          { day: 'Thu', temp: 26, icon: '🌧️' },
          { day: 'Fri', temp: 25, icon: '🌥️' },
        ],
        recommendations: [
          'Ideal conditions for rice cultivation',
          'Consider irrigation in the next 48 hours',
          'High humidity may increase disease risk',
        ],
      });
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
    >
      {/* Current Weather */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Weather Conditions</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm opacity-75">Temperature</p>
            <p className="text-2xl font-bold">{weather.temperature}°C</p>
          </div>
          <div>
            <p className="text-sm opacity-75">Humidity</p>
            <p className="text-2xl font-bold">{weather.humidity}%</p>
          </div>
          <div>
            <p className="text-sm opacity-75">Rainfall</p>
            <p className="text-2xl font-bold">{weather.rainfall}mm</p>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div className="p-4 border-b dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">5-Day Forecast</h4>
        <div className="flex justify-between">
          {weather.forecast.map((day, index) => (
            <div key={index} className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">{day.day}</p>
              <p className="text-xl my-1">{day.icon}</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{day.temp}°</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="p-4">
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Recommendations</h4>
        <ul className="space-y-2">
          {weather.recommendations.map((rec, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-start text-sm"
            >
              <svg
                className="w-4 h-4 text-primary-500 mt-0.5 mr-2 flex-shrink-0"
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
              <span className="text-gray-600 dark:text-gray-300">{rec}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default WeatherWidget; 