import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Results = ({ predictionResults, isLoading }) => {
  const navigate = useNavigate();
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [chartData, setChartData] = useState(null);

  // Redirect to form if no results are available
  useEffect(() => {
    if (!isLoading && !predictionResults) {
      navigate('/crop-form');
    } else if (predictionResults && predictionResults.top_recommendations && predictionResults.top_recommendations.length > 0) {
      // Set the default selected crop to the best recommendation
      setSelectedCrop(predictionResults.top_recommendations[0]);
    }
  }, [predictionResults, isLoading, navigate]);

  // Prepare chart data when selected crop changes
  useEffect(() => {
    if (selectedCrop) {
      prepareChartData(selectedCrop);
    }
  }, [selectedCrop]);

  const prepareChartData = (crop) => {
    const forecastData = crop.forecast;
    const years = forecastData.map(item => item.year.toString());
    
    // Prepare data for NPK values chart
    const npkData = {
      labels: years,
      datasets: [
        {
          label: 'Nitrogen (N)',
          data: forecastData.map(item => item.n_value),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          tension: 0.1,
        },
        {
          label: 'Phosphorus (P)',
          data: forecastData.map(item => item.p_value),
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          tension: 0.1,
        },
        {
          label: 'Potassium (K)',
          data: forecastData.map(item => item.k_value),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          tension: 0.1,
        },
      ],
    };
    
    // Prepare data for yield & profit chart
    const yieldProfitData = {
      labels: years,
      datasets: [
        {
          type: 'line',
          label: 'Yield (tons/ha)',
          data: forecastData.map(item => item.yield),
          borderColor: '#4f772d',
          backgroundColor: 'rgba(79, 119, 45, 0.5)',
          yAxisID: 'y',
          tension: 0.1,
        },
        {
          type: 'bar',
          label: 'Profit ($)',
          data: forecastData.map(item => item.profit),
          backgroundColor: '#90a955',
          yAxisID: 'y1',
        },
      ],
    };
    
    setChartData({
      npk: npkData,
      yieldProfit: yieldProfitData,
    });
  };

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

  if (!predictionResults) {
    return null; // Will redirect to form
  }

  const { best_crop, top_recommendations, message } = predictionResults;

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
            Crop Recommendation Results
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            {message}
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
              <h2 className="text-2xl font-bold text-primary-500">Best Recommendation: <span className="text-primary-400">{best_crop}</span></h2>
              <p className="mt-1 text-gray-600">Based on your soil conditions and location, we recommend growing {best_crop} for optimal yield and profit.</p>
              <div className="mt-3">
                <motion.button
                  onClick={() => setSelectedCrop(top_recommendations.find(crop => crop.crop === best_crop))}
                  className="btn btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View 5-Year Forecast
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Top Recommendations */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-primary-400 mb-4">Top Crop Recommendations</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {top_recommendations.map((crop, index) => (
              <div 
                key={index}
                className={`card cursor-pointer transition-all duration-200 ${selectedCrop && selectedCrop.crop === crop.crop ? 'ring-2 ring-primary-300 bg-primary-100/20' : 'hover:bg-gray-50'}`}
                onClick={() => setSelectedCrop(crop)}
              >
                <h3 className="text-xl font-semibold text-primary-500">{crop.crop}</h3>
                <div className="mt-2 space-y-1">
                  <p className="text-gray-600"><span className="font-medium">Avg. Yield:</span> {crop.average_yield} tons/ha</p>
                  <p className="text-gray-600"><span className="font-medium">Total Profit:</span> ${crop.total_profit}</p>
                </div>
                <div className="mt-4">
                  <button 
                    className={`text-sm font-medium ${selectedCrop && selectedCrop.crop === crop.crop ? 'text-primary-500' : 'text-primary-300'}`}
                  >
                    {selectedCrop && selectedCrop.crop === crop.crop ? 'Currently Viewing' : 'View Details'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 5-Year Forecast */}
        {selectedCrop && chartData && (
          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-primary-400 mb-4">5-Year Forecast for {selectedCrop.crop}</h2>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* NPK Levels Chart */}
              <div className="card">
                <h3 className="text-lg font-medium text-primary-500 mb-4">Soil Nutrient Levels Over Time</h3>
                <div className="h-80">
                  <Line
                    data={chartData.npk}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: 'NPK Values'
                          }
                        }
                      },
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        title: {
                          display: false,
                        },
                      },
                    }}
                  />
                </div>
              </div>
              
              {/* Yield and Profit Chart */}
              <div className="card">
                <h3 className="text-lg font-medium text-primary-500 mb-4">Yield and Profit Projection</h3>
                <div className="h-80">
                  <Bar
                    data={chartData.yieldProfit}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          type: 'linear',
                          display: true,
                          position: 'left',
                          title: {
                            display: true,
                            text: 'Yield (tons/ha)'
                          }
                        },
                        y1: {
                          type: 'linear',
                          display: true,
                          position: 'right',
                          grid: {
                            drawOnChartArea: false,
                          },
                          title: {
                            display: true,
                            text: 'Profit ($)'
                          }
                        },
                      },
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        title: {
                          display: false,
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* Detailed Forecast Table */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-primary-500 mb-4">Detailed Yearly Forecast</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-primary-400 text-white">
                    <tr>
                      <th className="py-2 px-3 text-left">Year</th>
                      <th className="py-2 px-3 text-left">N Value</th>
                      <th className="py-2 px-3 text-left">P Value</th>
                      <th className="py-2 px-3 text-left">K Value</th>
                      <th className="py-2 px-3 text-left">Yield (tons/ha)</th>
                      <th className="py-2 px-3 text-left">Production (tons)</th>
                      <th className="py-2 px-3 text-left">Profit ($)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedCrop.forecast.map((year, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="py-2 px-3">{year.year}</td>
                        <td className="py-2 px-3">{year.n_value}</td>
                        <td className="py-2 px-3">{year.p_value}</td>
                        <td className="py-2 px-3">{year.k_value}</td>
                        <td className="py-2 px-3">{year.yield}</td>
                        <td className="py-2 px-3">{year.production}</td>
                        <td className="py-2 px-3">${year.profit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <motion.button
            onClick={() => navigate('/crop-form')}
            className="btn btn-secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try Different Parameters
          </motion.button>
          <motion.button
            onClick={() => window.print()}
            className="btn btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Print Results
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Results; 