import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Results = ({ predictionResults, isLoading }) => {
  const navigate = useNavigate();

  // Redirect to form if no results are available
  if (!predictionResults && !isLoading) {
    navigate('/crop-form');
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-300 mx-auto"></div>
          <h2 className="mt-6 text-xl text-gray-700">Generating crop recommendations...</h2>
          <p className="mt-2 text-gray-500">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (!predictionResults?.recommendations) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl text-red-600">No recommendations available</h2>
          <button 
            onClick={() => navigate('/crop-form')}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const recommendations = predictionResults.recommendations;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="py-12 bg-gradient-to-b from-primary-100/30 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-extrabold text-primary-500 sm:text-4xl">
            Recommended Crops
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Based on your soil conditions and location, here are the best crop recommendations
          </p>
        </motion.div>

        {/* Best Crop Card */}
        <motion.div
          className="bg-white p-6 rounded-lg shadow-lg mb-8 border-l-4 border-primary-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row items-center">
            <div className="bg-primary-100 rounded-full p-4 mb-4 md:mb-0 md:mr-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary-500">
                Best Recommendation: <span className="text-primary-400">{recommendations[0].crop}</span>
              </h2>
              <p className="mt-1 text-gray-600">
                Expected yield: {recommendations[0].yield} tons/ha | 
                Estimated profit: {formatCurrency(recommendations[0].profit)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* All Recommendations */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-primary-400 mb-4">All Recommended Crops</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {recommendations.map((crop, index) => (
              <motion.div
                key={crop.crop}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
              >
                <h3 className="text-xl font-semibold text-primary-500 mb-3">{crop.crop}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expected Yield:</span>
                    <span className="font-medium">{crop.yield} tons/ha</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Revenue:</span>
                    <span className="font-medium text-green-600">{formatCurrency(crop.revenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cost:</span>
                    <span className="font-medium text-red-600">{formatCurrency(crop.cost)}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between">
                      <span className="text-gray-800 font-medium">Net Profit:</span>
                      <span className="font-bold text-primary-600">{formatCurrency(crop.profit)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tips Section */}
        <motion.div
          className="bg-white p-6 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-xl font-bold text-primary-400 mb-4">Important Notes</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>These recommendations are based on your soil NPK values, location, and historical data</li>
            <li>Profit calculations include estimated market prices and standard production costs</li>
            <li>Consider crop rotation practices for soil health maintenance</li>
            <li>Actual yields may vary based on weather conditions and farming practices</li>
          </ul>
          <div className="mt-6 flex justify-center">
            <motion.button
              onClick={() => navigate('/crop-form')}
              className="btn btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Make Another Prediction
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Results;