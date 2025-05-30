import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="py-12 bg-gradient-to-b from-primary-100/30 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-extrabold text-primary-500 sm:text-4xl">
            About CropSmart
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Helping farmers make intelligent crop selection decisions through advanced data analysis and machine learning
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <motion.div
            className="card"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-primary-400 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              CropSmart aims to revolutionize farming by providing data-driven insights and predictive analytics to farmers worldwide. Our goal is to optimize crop selection, maximize yields, and ensure sustainable farming practices.
            </p>
            <p className="text-gray-600">
              We believe that by combining traditional farming knowledge with modern technology and data science, we can help create a more sustainable and productive agricultural sector that benefits both farmers and the planet.
            </p>
          </motion.div>

          <motion.div
            className="card"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-primary-400 mb-4">How It Works</h2>
            <p className="text-gray-600 mb-4">
              Our system uses advanced machine learning algorithms to analyze soil conditions, historical crop data, and environmental factors to predict which crops will thrive in specific conditions.
            </p>
            <p className="text-gray-600">
              The Gradient Boosting Regressor model at the heart of our system has been trained on extensive agricultural datasets, allowing it to make accurate predictions about crop yields and soil health over multiple growing seasons.
            </p>
          </motion.div>
        </div>

        <motion.div
          className="mt-12 card"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-primary-400 mb-4">The Technology Behind CropSmart</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-primary-300">Machine Learning Model</h3>
              <p className="text-gray-600 mt-2">
                We use the Gradient Boosting Regressor algorithm from scikit-learn to analyze multiple features including soil NPK values, rainfall patterns, land area, and previous crop history. This ensemble learning technique combines multiple decision trees to create a powerful predictive model.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-primary-300">Data Processing</h3>
              <p className="text-gray-600 mt-2">
                Our system processes agricultural data from various sources, including historical yield data, soil nutrient profiles, and weather patterns. We use this information to generate five-year forecasts that account for soil depletion, yield trends, and profitability.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-primary-300">Combinatorial Analysis</h3>
              <p className="text-gray-600 mt-2">
                We leverage combinatorial techniques to evaluate all possible crop combinations and sequences, considering constraints such as crop compatibility, seasonal limitations, and market demand to find optimal rotation patterns.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-primary-300">Dynamic Forecasting</h3>
              <p className="text-gray-600 mt-2">
                Using recurrence relations, our system models how soil conditions evolve over time based on crop selection, allowing farmers to visualize the long-term impacts of their agricultural decisions.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="mt-12 bg-primary-400 text-white rounded-lg p-8 shadow-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="md:flex md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold">Join the Agricultural Revolution</h2>
              <p className="mt-2 text-primary-100">
                Start making data-driven decisions for your farm today with CropSmart
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <a href="/crop-form" className="inline-block px-6 py-3 bg-white text-primary-500 font-medium rounded-md hover:bg-primary-100 transition-colors">
                Try It Now
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About; 