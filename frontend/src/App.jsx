import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import CropPredictor from './pages/CropPredictor';
import Dashboard from './pages/Dashboard';
import Auth from './components/Auth';
import AIChatbot from './components/AIChatbot';
import SoilHealth from './pages/SoilHealth';
import WeatherAnalysis from './pages/WeatherAnalysis';

const PageTransition = ({ children }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

function App() {
  const [predictionResults, setPredictionResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [smartPredictionResults, setSmartPredictionResults] = useState(null);
  const [isSmartLoading, setIsSmartLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <ThemeProvider>
      <Router>
        <motion.div 
          className="flex flex-col min-h-screen bg-gradient-to-b from-leaf-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Navbar />
          <main className="flex-grow">
            <PageTransition>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Auth />} />
                <Route 
                  path="/dashboard" 
                  element={
                    isAuthenticated ? (
                      <Dashboard />
                    ) : (
                      <Auth />
                    )
                  } 
                />
                <Route path="/about" element={<About />} />
                <Route path="/predictor" element={<CropPredictor />} />
                <Route path="/soil-health" element={<SoilHealth />} />
                <Route path="/weather" element={<WeatherAnalysis />} />
              </Routes>
            </PageTransition>
          </main>
          <Footer />
          <AIChatbot />
        </motion.div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
