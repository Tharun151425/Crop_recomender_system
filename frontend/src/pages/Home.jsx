import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity:.0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="bg-gradient-to-b from-primary-100/30 to-white">
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <motion.div 
              className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl tracking-tight font-extrabold text-primary-500 sm:text-5xl md:text-6xl">
                <span className="block">Growing smarter</span>
                <span className="block text-primary-300">with data-driven farming</span>
              </h1>
              <p className="mt-3 text-base text-gray-600 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Optimize your crop selection using advanced machine learning. Predict yields, plan rotations, and maximize profits with our science-backed recommendations.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left">
                <Link to="/crop-form" className="btn btn-primary inline-block text-lg px-6 py-3">
                  Get Crop Recommendations
                </Link>
              </div>
            </motion.div>
            <motion.div 
              className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <img
                  className="w-full rounded-lg"
                  src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                  alt="Farmer in field"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-extrabold text-primary-400 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Our intelligent crop recommendation system helps you make data-driven decisions for your farm
            </p>
          </motion.div>

          <motion.div 
            className="mt-16"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <motion.div className="card" variants={item}>
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-200 text-white mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-primary-500">Input Your Data</h3>
                <p className="mt-2 text-gray-600">
                  Provide information about your soil conditions, previous crops, location, and land area.
                </p>
              </motion.div>

              <motion.div className="card" variants={item}>
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-200 text-white mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-primary-500">AI Analysis</h3>
                <p className="mt-2 text-gray-600">
                  Our machine learning algorithm analyzes your data and predicts the best crops for your conditions.
                </p>
              </motion.div>

              <motion.div className="card" variants={item}>
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-200 text-white mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-primary-500">5-Year Forecast</h3>
                <p className="mt-2 text-gray-600">
                  Get a detailed 5-year projection of yields, soil health, and profits for recommended crops.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-primary-100/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-extrabold text-primary-400 sm:text-4xl">
              Benefits for Farmers
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of farmers who have improved their yields and profits
            </p>
          </motion.div>

          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <motion.div 
              className="card border-t-4 border-primary-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="text-xl font-semibold text-primary-500">Increased Yield</h3>
              <p className="mt-2 text-gray-600">
                Farmers using our system report an average 15-20% increase in crop yields.
              </p>
            </motion.div>

            <motion.div 
              className="card border-t-4 border-primary-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold text-primary-500">Soil Health</h3>
              <p className="mt-2 text-gray-600">
                Optimize soil nutrient levels and reduce degradation through smart crop rotation.
              </p>
            </motion.div>

            <motion.div 
              className="card border-t-4 border-primary-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-primary-500">Higher Profits</h3>
              <p className="mt-2 text-gray-600">
                Make informed decisions that lead to better financial outcomes for your farm.
              </p>
            </motion.div>

            <motion.div 
              className="card border-t-4 border-primary-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="text-xl font-semibold text-primary-500">Reduced Risk</h3>
              <p className="mt-2 text-gray-600">
                Minimize crop failure risk by growing crops best suited to your specific conditions.
              </p>
            </motion.div>

            <motion.div 
              className="card border-t-4 border-primary-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h3 className="text-xl font-semibold text-primary-500">Long-term Planning</h3>
              <p className="mt-2 text-gray-600">
                Make strategic decisions with our 5-year projections for crop rotation.
              </p>
            </motion.div>

            <motion.div 
              className="card border-t-4 border-primary-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h3 className="text-xl font-semibold text-primary-500">Sustainable Farming</h3>
              <p className="mt-2 text-gray-600">
                Adopt practices that preserve your land for future generations.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="bg-primary-400 rounded-lg shadow-xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="px-6 py-12 md:px-12 text-center md:text-left">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h2 className="text-3xl font-extrabold text-white">
                    Ready to optimize your farm?
                  </h2>
                  <p className="mt-4 text-lg text-primary-100">
                    Get personalized crop recommendations based on your specific conditions. Our system is free to use for all farmers.
                  </p>
                </div>
                <div className="mt-8 md:mt-0 flex items-center justify-center md:justify-end">
                  <Link to="/crop-form" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-primary-500 bg-white hover:bg-primary-100 transition-colors">
                    Start Now
                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home; 