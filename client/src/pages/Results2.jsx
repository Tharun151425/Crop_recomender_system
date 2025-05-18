import { useNavigate } from 'react-router-dom';

const Results2 = ({ predictionResults, isLoading }) => {
  const navigate = useNavigate();

  if (!predictionResults && !isLoading) {
    navigate('/crop-form2');
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4">Analyzing soil conditions and generating recommendations...</p>
        </div>
      </div>
    );
  }

  if (!predictionResults?.recommendations) {
    return (
      <div className="text-center mt-8">
        <p className="text-red-500">No recommendations available</p>
        <button 
          onClick={() => navigate('/crop-form2')}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Smart Crop Recommendations</h2>
      
      {/* Input Summary */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Input Parameters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><span className="font-medium">Location:</span> {predictionResults.input?.location || 'N/A'}</p>
            <p><span className="font-medium">Season:</span> {predictionResults.input?.season || 'N/A'}</p>
            <p><span className="font-medium">Land Area:</span> {predictionResults.input?.area || 'N/A'} hectares</p>
          </div>
          <div>
            <p><span className="font-medium">Nitrogen (N):</span> {predictionResults.input?.n_value || 'N/A'} kg/ha</p>
            <p><span className="font-medium">Phosphorus (P):</span> {predictionResults.input?.p_value || 'N/A'} kg/ha</p>
            <p><span className="font-medium">Potassium (K):</span> {predictionResults.input?.k_value || 'N/A'} kg/ha</p>
          </div>
        </div>
      </div>

      {/* Best Recommendation */}
      <div className="bg-green-50 p-4 rounded-lg mb-6 border border-green-200">
        <h3 className="text-lg font-semibold text-green-800">
          Best Recommendation: {predictionResults.recommendations[0].crop}
        </h3>
        <p className="text-green-600">
          Expected yield: {predictionResults.recommendations[0].yield} tons/ha |
          Estimated profit: {formatCurrency(predictionResults.recommendations[0].profit)}
        </p>
      </div>

      {/* All Recommendations */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Crop</th>
              <th className="px-4 py-2 text-right">Yield (tons/ha)</th>
              <th className="px-4 py-2 text-right">Revenue</th>
              <th className="px-4 py-2 text-right">Cost</th>
              <th className="px-4 py-2 text-right">Profit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {predictionResults.recommendations.map((crop, index) => (
              <tr key={crop.crop} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-2">{crop.crop}</td>
                <td className="px-4 py-2 text-right">{crop.yield}</td>
                <td className="px-4 py-2 text-right text-green-600">{formatCurrency(crop.revenue)}</td>
                <td className="px-4 py-2 text-right text-red-600">{formatCurrency(crop.cost)}</td>
                <td className="px-4 py-2 text-right font-medium">
                  <span className={crop.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {formatCurrency(crop.profit)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => navigate('/crop-form2')}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Make Another Prediction
        </button>
      </div>
    </div>
  );
};

export default Results2;
