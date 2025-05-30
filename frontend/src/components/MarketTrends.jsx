import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const MarketTrends = () => {
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock market data - replace with actual API call
    setTimeout(() => {
      setMarketData({
        crops: [
          {
            name: 'Rice',
            currentPrice: 2200,
            change: 5.2,
            trend: 'up',
            forecast: 'rising',
            demand: 'high',
          },
          {
            name: 'Wheat',
            currentPrice: 1850,
            change: -2.1,
            trend: 'down',
            forecast: 'stable',
            demand: 'medium',
          },
          {
            name: 'Maize',
            currentPrice: 1650,
            change: 1.8,
            trend: 'up',
            forecast: 'rising',
            demand: 'high',
          },
          {
            name: 'Soybeans',
            currentPrice: 3200,
            change: 3.5,
            trend: 'up',
            forecast: 'rising',
            demand: 'high',
          },
        ],
        insights: [
          'Rice prices expected to rise due to increased export demand',
          'Wheat market stabilizing after recent fluctuations',
          'Strong domestic demand for maize continues',
        ],
      });
      setLoading(false);
    }, 1500);
  }, []);

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-green-500' : 'text-red-500';
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ) : (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
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
      {/* Header */}
      <div className="p-6 border-b dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Market Trends</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Latest prices and market insights</p>
      </div>

      {/* Price Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Crop</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price (₹/q)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Change</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Forecast</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Demand</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {marketData.crops.map((crop, index) => (
              <motion.tr
                key={crop.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {crop.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  ₹{crop.currentPrice.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className={`flex items-center ${getTrendColor(crop.trend)}`}>
                    {getTrendIcon(crop.trend)}
                    <span className="ml-1">{crop.change}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {crop.forecast}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    crop.demand === 'high'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : crop.demand === 'medium'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {crop.demand}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Market Insights */}
      <div className="p-6 bg-gray-50 dark:bg-gray-900/50">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Market Insights</h4>
        <ul className="space-y-3">
          {marketData.insights.map((insight, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-start text-sm text-gray-600 dark:text-gray-300"
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {insight}
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default MarketTrends; 