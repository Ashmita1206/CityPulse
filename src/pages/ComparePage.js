import React, { useState, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { getReports } from '../firebase/reportService';
import { fetchComparativeMetrics } from '../services/cityMetricsService';
import indianCities from '../data/indianCities';


const ComparePage = () => {
  const [city1, setCity1] = useState('');
  const [city2, setCity2] = useState('');
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    getReports().then(setReports);
  }, []);

  const handleCompare = async () => {
    if (!city1 || !city2) return;
    
    setLoading(true);
    try {
      // Get comprehensive city metrics
      const comparativeData = await fetchComparativeMetrics([city1, city2]);
      
      // Filter reports for both cities
      const city1Reports = reports.filter(r => 
        r.location?.city === city1 || r.location?.area === city1 || r.city === city1
      );
      const city2Reports = reports.filter(r => 
        r.location?.city === city2 || r.location?.area === city2 || r.city === city2
      );

      // Prepare data for comparison
      const city1Data = {
        name: city1,
        reports: city1Reports,
        reportCount: city1Reports.length,
        categories: Array.from(new Set(city1Reports.map(r => r.aiTag || r.category))),
        metrics: comparativeData.metrics[0]
      };

      const city2Data = {
        name: city2,
        reports: city2Reports,
        reportCount: city2Reports.length,
        categories: Array.from(new Set(city2Reports.map(r => r.aiTag || r.category))),
        metrics: comparativeData.metrics[1]
      };

      // Generate comparison using Gemini
      const prompt = `Compare ${city1} and ${city2} based on:
        ${city1}: AQI ${city1Data.metrics.aqi}, Temp ${city1Data.metrics.temperature}°C, ${city1Data.reportCount} reports, categories: ${city1Data.categories.join(', ')}
        ${city2}: AQI ${city2Data.metrics.aqi}, Temp ${city2Data.metrics.temperature}°C, ${city2Data.reportCount} reports, categories: ${city2Data.categories.join(', ')}
        
        Provide insights on:
        1. Environmental conditions comparison
        2. Urban activity levels
        3. Common issues and challenges
        4. Recommendations for each city`;

      const aiResponse = await geminiService.analyzeTextReport(prompt, 'general');
      
      setComparison({
        city1: city1Data,
        city2: city2Data,
        summary: aiResponse.summary || 'Comparison analysis completed.',
        insights: [...comparativeData.insights, ...(aiResponse.recommendations || [])],
        metrics: comparativeData.metrics
      });
    } catch (error) {
      console.error('Comparison failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-800 mb-8 text-center">🏙️ City Comparison</h1>
        
        {/* City Selection */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Select Cities to Compare</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">City 1</label>
              <select
                value={city1}
                onChange={(e) => setCity1(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Select a city</option>
                {indianCities.map(city => (
                  <option key={city.name} value={city.name}>{city.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">City 2</label>
              <select
                value={city2}
                onChange={(e) => setCity2(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Select a city</option>
                {indianCities.map(city => (
                  <option key={city.name} value={city.name}>{city.name}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={handleCompare}
            disabled={!city1 || !city2 || loading}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Comparing...' : 'Compare Cities'}
          </button>
        </div>

        {/* Comparison Results */}
        {comparison && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-3">AI-Generated Comparison</h3>
              <p className="text-gray-700">{comparison.summary}</p>
            </div>

            {/* City Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-3 text-blue-700">{comparison.city1.name}</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded">
                      <div className="text-2xl font-bold text-blue-600">{comparison.city1.metrics.aqi}</div>
                      <div className="text-xs text-gray-600">AQI</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded">
                      <div className="text-2xl font-bold text-red-600">{comparison.city1.metrics.temperature}°C</div>
                      <div className="text-xs text-gray-600">Temperature</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded">
                      <div className="text-2xl font-bold text-green-600">{comparison.city1.metrics.humidity}%</div>
                      <div className="text-xs text-gray-600">Humidity</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded">
                      <div className="text-2xl font-bold text-yellow-600">{comparison.city1.metrics.noise} dB</div>
                      <div className="text-xs text-gray-600">Noise</div>
                    </div>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span>Reports:</span>
                      <span className="font-semibold">{comparison.city1.reportCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Events:</span>
                      <span className="font-semibold">{comparison.city1.metrics.events}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Traffic:</span>
                      <span className="font-semibold">{comparison.city1.metrics.traffic}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-3 text-green-700">{comparison.city2.name}</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded">
                      <div className="text-2xl font-bold text-blue-600">{comparison.city2.metrics.aqi}</div>
                      <div className="text-xs text-gray-600">AQI</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded">
                      <div className="text-2xl font-bold text-red-600">{comparison.city2.metrics.temperature}°C</div>
                      <div className="text-xs text-gray-600">Temperature</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded">
                      <div className="text-2xl font-bold text-green-600">{comparison.city2.metrics.humidity}%</div>
                      <div className="text-xs text-gray-600">Humidity</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded">
                      <div className="text-2xl font-bold text-yellow-600">{comparison.city2.metrics.noise} dB</div>
                      <div className="text-xs text-gray-600">Noise</div>
                    </div>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span>Reports:</span>
                      <span className="font-semibold">{comparison.city2.reportCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Events:</span>
                      <span className="font-semibold">{comparison.city2.metrics.events}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Traffic:</span>
                      <span className="font-semibold">{comparison.city2.metrics.traffic}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Insights */}
            {comparison.insights && comparison.insights.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-3">Key Insights</h3>
                <ul className="space-y-2">
                  {comparison.insights.map((insight, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span className="text-gray-700">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparePage; 