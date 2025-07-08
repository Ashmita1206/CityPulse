import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  MapPinIcon,
  BellIcon,
  ArrowDownTrayIcon,
  ChartPieIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { mockPredictions, mockMoodMap } from '../data/mockData';
import { geminiService } from '../services/geminiService';
import toast from 'react-hot-toast';
import MapComponent from '../components/MapComponent';
import indianCities from '../data/indianCities';
import { fetchCityMetrics } from '../services/cityMetricsService';

const Predict = () => {
  const [predictions, setPredictions] = useState(mockPredictions);
  const [moodMap, setMoodMap] = useState(mockMoodMap);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('6h');
  const [aiSummary, setAiSummary] = useState('');
  const [exporting, setExporting] = useState(false);
  const [selectedCity, setSelectedCity] = useState(indianCities[0]);
  const [cityMetrics, setCityMetrics] = useState(null);

  const timeframes = [
    { value: '2h', label: '2 Hours' },
    { value: '6h', label: '6 Hours' },
    { value: '12h', label: '12 Hours' },
    { value: '24h', label: '24 Hours' }
  ];

  useEffect(() => {
    setCityMetrics(null);
    fetchCityMetrics(selectedCity.name).then(metrics => {
      console.log('[CityPulse] Predict cityMetrics:', metrics);
      setCityMetrics(metrics);
    });
  }, [selectedCity]);

  useEffect(() => {
    async function fetchSummary() {
      const summary = await geminiService.analyzeTextReport(
        predictions.map(p => p.message).join(' '),
        'traffic'
      );
      setAiSummary(summary.summary);
    }
    fetchSummary();
  }, [predictions]);

  const generatePredictions = async () => {
    setIsGenerating(true);
    try {
      const result = await geminiService.generatePredictions([]);
      setPredictions(result.alerts);
      setMoodMap(result.moodMap);
      toast.success('Predictions updated!');
    } catch (error) {
      console.error('Prediction generation error:', error);
      toast.error('Failed to generate predictions');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportCSV = () => {
    setExporting(true);
    const csv = [
      ['Type', 'Area', 'Probability', 'Message', 'Timeframe'],
      ...predictions.map(p => [p.type, p.area, p.probability, p.message, p.timeframe])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'predictions.csv';
    a.click();
    setTimeout(() => setExporting(false), 1000);
  };

  const getProbabilityColor = (probability) => {
    if (probability >= 0.7) return 'text-red-600 dark:text-red-400';
    if (probability >= 0.4) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getProbabilityBg = (probability) => {
    if (probability >= 0.7) return 'bg-red-100 dark:bg-red-900/20';
    if (probability >= 0.4) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-green-100 dark:bg-green-900/20';
  };

  // Safely get sentiment color
  const getSentimentColor = (sentiment) => {
    const safeSentiment = (sentiment || 'neutral').toLowerCase();
    switch (safeSentiment) {
      case 'positive':
        return 'text-green-600 dark:text-green-400';
      case 'negative':
      case 'frustrated':
        return 'text-red-600 dark:text-red-400';
      case 'concerned':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'neutral':
        return 'text-gray-600 dark:text-gray-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  // Chart data
  const typeCounts = predictions.reduce((acc, p) => {
    acc[p.type] = (acc[p.type] || 0) + 1;
    return acc;
  }, {});
  const typeChart = Object.entries(typeCounts).map(([type, count]) => ({ type, count }));
  const highRisk = predictions.filter(p => p.probability >= 0.7).length;
  const avgConfidence = predictions.length > 0 ? Math.round(predictions.reduce((acc, p) => acc + p.probability, 0) / predictions.length * 100) : 0;

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Predictive Analytics
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            AI-powered forecasting to help you stay ahead of urban events
          </p>
        </motion.div>

        {/* City Dropdown & Metrics */}
        <div className="card mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">City:</label>
            <select
              value={selectedCity.name}
              onChange={e => setSelectedCity(indianCities.find(c => c.name === e.target.value))}
              className="input-field text-sm max-w-xs"
            >
              {indianCities.map(city => (
                <option key={city.name} value={city.name}>{city.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 flex flex-wrap gap-4 items-center">
            {cityMetrics && (
              <>
                <div className="card text-center p-4 min-w-[120px]">
                  <div className="text-xs text-gray-500">AQI</div>
                  <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                    {typeof cityMetrics.aqi === 'number' ? (
                      <span>{cityMetrics.aqi}</span>
                    ) : (
                      <span className="text-gray-400 italic opacity-70" title="Live data not available for this city right now.">{cityMetrics.aqi}</span>
                    )}
                  </div>
                </div>
                <div className="card text-center p-4 min-w-[120px]">
                  <div className="text-xs text-gray-500">Temp (°C)</div>
                  <div className="text-lg font-bold text-red-600 dark:text-red-400">
                    {typeof cityMetrics.temp === 'number' ? (
                      <span>{cityMetrics.temp}</span>
                    ) : (
                      <span className="text-gray-400 italic opacity-70" title="Live data not available for this city right now.">{cityMetrics.temp}</span>
                    )}
                  </div>
                </div>
                <div className="card text-center p-4 min-w-[120px]">
                  <div className="text-xs text-gray-500">Humidity (%)</div>
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    {typeof cityMetrics.humidity === 'number' ? (
                      <span>{cityMetrics.humidity}</span>
                    ) : (
                      <span className="text-gray-400 italic opacity-70" title="Live data not available for this city right now.">{cityMetrics.humidity}</span>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="flex-1">
            {cityMetrics && cityMetrics.tips[selectedCity.name] && (
              <div className="card bg-blue-50 dark:bg-blue-900/20 p-4 text-sm text-blue-900 dark:text-blue-100">
                <span className="font-semibold">Smart Tip:</span> {cityMetrics.tips[selectedCity.name]}
              </div>
            )}
          </div>
        </div>

        {/* AI Summary & Export */}
        <div className="card mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <SparklesIcon className="h-5 w-5 text-blue-500" />
              <span className="font-semibold text-gray-900 dark:text-white">AI Summary</span>
            </div>
            <div className="text-gray-700 dark:text-gray-300 text-sm max-w-2xl">
              {aiSummary}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              disabled={exporting}
              className="btn-secondary flex items-center space-x-2"
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <ChartBarIcon className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Prediction Timeframe:
              </span>
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="input-field text-sm max-w-xs"
              >
                {timeframes.map((timeframe) => (
                  <option key={timeframe.value} value={timeframe.value}>
                    {timeframe.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={generatePredictions}
              disabled={isGenerating}
              className="btn-primary inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowTrendingUpIcon className="h-4 w-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Update Predictions'}
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div className="card text-center">
            <div className="flex justify-center mb-2"><ChartBarIcon className="h-6 w-6 text-blue-500" /></div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {predictions.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Active Predictions
            </div>
          </div>
          <div className="card text-center">
            <div className="flex justify-center mb-2"><ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" /></div>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {highRisk}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              High Risk Alerts
            </div>
          </div>
          <div className="card text-center">
            <div className="flex justify-center mb-2"><ChartPieIcon className="h-6 w-6 text-purple-500" /></div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {Object.keys(moodMap).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Monitored Areas
            </div>
          </div>
          <div className="card text-center">
            <div className="flex justify-center mb-2"><ChartBarIcon className="h-6 w-6 text-green-500" /></div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {avgConfidence}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Avg. Confidence
            </div>
          </div>
        </motion.div>

        {/* Map Section */}
        <div className="mb-8 card p-0 overflow-hidden h-96">
          <MapComponent
            reports={predictions.map(p => ({ ...p, lat: selectedCity.lat, lon: selectedCity.lon, title: p.type, address: p.area, category: p.type }))}
            city={selectedCity}
            showWeather={true}
            showAQI={true}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Predictions Timeline */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Predictive Alerts
              </h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {predictions.length} alerts
              </div>
            </div>
            <div className="space-y-4">
              {predictions.map((prediction, index) => (
                <motion.div
                  key={prediction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`p-4 rounded-lg border-l-4 ${getProbabilityBg(prediction.probability)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {prediction.type}
                        </h3>
                        <span className={`text-sm font-medium px-2 py-1 rounded-full ${getProbabilityColor(prediction.probability)} bg-white dark:bg-gray-700`}>
                          {Math.round(prediction.probability * 100)}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {prediction.message}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <MapPinIcon className="h-3 w-3" />
                          <span>{prediction.area}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>{selectedTimeframe}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Mood Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Public Sentiment Map
              </h2>
              <BellIcon className="h-5 w-5 text-gray-500" />
            </div>
            <div className="space-y-4">
              {Object.entries(moodMap).map(([area, data], index) => (
                <motion.div
                  key={area}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-medium text-gray-900 dark:text-white capitalize">
                      {area.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                    <span className={`text-sm font-medium ${getSentimentColor(data.sentiment)}`}> 
                      {data.sentiment ?? 'Neutral'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Intensity</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${data.intensity * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-500 dark:text-gray-400 text-xs">
                          {Math.round(data.intensity * 100)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Reports</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {data.reports}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Simple Bar Chart (Prediction Types) */}
        <div className="mt-8 card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center"><ChartBarIcon className="h-5 w-5 mr-2 text-blue-500" /> Predictions by Type</h3>
          <div className="flex items-end gap-4 h-40">
            {typeChart.map(type => (
              <div key={type.type} className="flex-1 flex flex-col items-center">
                <div className={`w-8 rounded-t-lg transition-all duration-300 ${type.count > 0 ? 'bg-blue-500 dark:bg-blue-400' : 'bg-gray-200 dark:bg-gray-700'}`} style={{ height: `${type.count * 10 + 10}px` }}></div>
                <span className="mt-2 text-xs text-gray-700 dark:text-gray-300">{type.type}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{type.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Predict; 