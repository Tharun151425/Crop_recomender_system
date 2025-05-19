import { useNavigate } from 'react-router-dom';

const Results3 = ({ predictionResults, isLoading }) => {
  const navigate = useNavigate();

  if (!predictionResults && !isLoading) {
    navigate('/crop-form3');
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4">Analyzing soil conditions and generating season-based recommendations...</p>
        </div>
      </div>
    );
  }

  if (!predictionResults?.plans || predictionResults.plans.length === 0) {
    return (
      <div className="text-center mt-8">
        <p className="text-red-500">No recommendations available</p>
        <button 
          onClick={() => navigate('/crop-form3')}
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

  const formatNumber = (value) => {
    return Number(value).toFixed(2);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">
        {predictionResults.input?.season} Season Crop Recommendations
      </h2>
      
      {/* Input Summary */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Input Parameters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><span className="font-medium">Region:</span> {predictionResults.input?.region}</p>
            <p><span className="font-medium">Season:</span> {predictionResults.input?.season}</p>
            <p><span className="font-medium">Land Area:</span> {predictionResults.input?.area} hectares</p>
          </div>
          <div>
            <p><span className="font-medium">Nitrogen (N):</span> {predictionResults.input?.n_value} kg/ha</p>
            <p><span className="font-medium">Phosphorus (P₂O₅):</span> {predictionResults.input?.p_value} kg/ha</p>
            <p><span className="font-medium">Potassium (K₂O):</span> {predictionResults.input?.k_value} kg/ha</p>
          </div>
        </div>
      </div>

      {/* Crop Plans */}
      {predictionResults.plans.map((plan, planIndex) => (
        <div key={planIndex} className="mb-8">
          <h3 className="text-xl font-semibold mb-4">
            Plan {plan.planNumber} (Starting with {plan.startCrop})
          </h3>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Year</th>
                  <th className="px-4 py-2 text-left">Crop</th>
                  <th className="px-4 py-2 text-right">Yield (q/ha)</th>
                  <th className="px-4 py-2 text-right">Revenue (₹)</th>
                  <th className="px-4 py-2 text-right">N-P-K Before</th>
                  <th className="px-4 py-2 text-right">Fertilizer Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {plan.predictions.map((pred, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-2">{pred.Year}</td>
                    <td className="px-4 py-2">{pred.Crop}</td>
                    <td className="px-4 py-2 text-right">
                      {formatNumber(pred['Predicted Yield (q/ha)'])}
                    </td>
                    <td className="px-4 py-2 text-right text-green-600">
                      {formatCurrency(pred['Revenue (₹)'])}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {pred['NPK Before'].map(v => formatNumber(v)).join(' - ')}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {pred['Fertilizer Added'].join(' - ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <div className="mt-6 text-center">
        <button
          onClick={() => navigate('/crop-form3')}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Make Another Prediction
        </button>
      </div>
    </div>
  );
};

export default Results3;
