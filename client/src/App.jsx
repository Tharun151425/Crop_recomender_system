import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CropForm from './pages/CropForm';
import Results from './pages/Results';
import About from './pages/About';
import './App.css'

function App() {
  const [predictionResults, setPredictionResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
              path="/results" 
              element={
                <Results 
                  predictionResults={predictionResults} 
                  isLoading={isLoading}
                />
              } 
            />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
