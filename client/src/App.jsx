import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CropForm from './pages/CropForm';
import CropForm2 from './pages/CropForm2';
import CropForm3 from './pages/CropForm3';
import Results from './pages/Results';
import Results2 from './pages/Results2';
import Results3 from './pages/Results3';
import About from './pages/About';
import CropPredictor from './pages/CropPredictor';
import './App.css';

function App() {
  const [predictionResults, setPredictionResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [smartPredictionResults, setSmartPredictionResults] = useState(null);
  const [isSmartLoading, setIsSmartLoading] = useState(false);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/crop-form" 
              element={
                <CropForm 
                  setPredictionResults={setPredictionResults} 
                  setIsLoading={setIsLoading}
                />
              } 
            />
            <Route 
              path="/crop-form2" 
              element={
                <CropForm2 
                  setPredictionResults={setSmartPredictionResults} 
                  setIsLoading={setIsSmartLoading}
                />
              } 
            />
            <Route 
              path="/results" 
              element={
                <Results 
                  predictionResults={predictionResults} 
                  isLoading={isLoading}
                />
              } 
            />
            <Route 
              path="/results2" 
              element={
                <Results2 
                  predictionResults={smartPredictionResults} 
                  isLoading={isSmartLoading}
                />
              } 
            />
            <Route path="/crop-form3" element={<CropForm3 setPredictionResults={setPredictionResults} setIsLoading={setIsLoading} />} />
            <Route path="/results3" element={<Results3 predictionResults={predictionResults} isLoading={isLoading} />} />
            <Route path="/about" element={<About />} />
            <Route path="/predictor" element={<CropPredictor />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
