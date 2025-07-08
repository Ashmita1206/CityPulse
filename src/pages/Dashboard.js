import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FunnelIcon, 
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ArrowDownTrayIcon,
  ChartBarIcon,
  ChartPieIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { mockReports, categories } from '../data/mockData';
import MapComponent from '../components/MapComponent';
import ReportCard from '../components/ReportCard';
import { geminiService } from '../services/geminiService';
import indianCities from '../data/indianCities';
import { fetchCityMetrics } from '../services/cityMetricsService';

const robustMockReports = [
  // Delhi
  { city: 'Delhi', category: 'Traffic', severity: 'High', description: 'Massive congestion on Ring Road near AIIMS.', timestamp: '2025-07-06T10:00:00Z' },
  { city: 'Delhi', category: 'Power', severity: 'Medium', description: 'Power outage in South Delhi (Kalkaji).', timestamp: '2025-07-06T09:00:00Z' },
  { city: 'Delhi', category: 'Civic', severity: 'Low', description: 'Garbage pile-up near Sarojini Nagar market.', timestamp: '2025-07-06T08:30:00Z' },
  { city: 'Delhi', category: 'Traffic', severity: 'Medium', description: 'Slow-moving traffic on Outer Ring Road.', timestamp: '2025-07-06T07:45:00Z' },
  { city: 'Delhi', category: 'Power', severity: 'High', description: 'Transformer failure in Connaught Place.', timestamp: '2025-07-06T07:00:00Z' },
  // Mumbai
  { city: 'Mumbai', category: 'Civic', severity: 'Medium', description: 'Waterlogging in Andheri East.', timestamp: '2025-07-06T10:15:00Z' },
  { city: 'Mumbai', category: 'Traffic', severity: 'Low', description: 'Minor accident on Western Express Highway.', timestamp: '2025-07-06T09:30:00Z' },
  // Bengaluru
  { city: 'Bengaluru', category: 'Power', severity: 'Low', description: 'Brief power cut in Koramangala.', timestamp: '2025-07-06T08:00:00Z' },
  { city: 'Bengaluru', category: 'Traffic', severity: 'High', description: 'Heavy traffic on Silk Board junction.', timestamp: '2025-07-06T07:30:00Z' },
];

const Dashboard = () => {
  const [reports] = useState(mockReports.length > 0 ? mockReports : robustMockReports);
  const [filteredReports, setFilteredReports] = useState(mockReports.length > 0 ? mockReports : robustMockReports);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState(indianCities[0]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [exporting, setExporting] = useState(false);
  const [cityMetrics, setCityMetrics] = useState(null);

  // Fetch city metrics on city change
  useEffect(() => {
    setCityMetrics(null);
    fetchCityMetrics(selectedCity.name).then(metrics => {
      // Fallback: If all metrics are null, inject mock values for demo
      if (
        (metrics.temperature === null || typeof metrics.temperature !== 'number') &&
        (metrics.humidity === null || typeof metrics.humidity !== 'number') &&
        (metrics.aqi === null || typeof metrics.aqi !== 'number')
      ) {
        // Demo fallback for Delhi
        if (selectedCity.name === 'Delhi') {
          metrics.temperature = 36;
          metrics.humidity = 48;
          metrics.aqi = 180;
          metrics.tips = [
            'High AQI in winter. Use masks and avoid outdoor activity on smoggy days.',
            'Fog can disrupt travel in winter. Plan accordingly.'
          ];
        } else if (selectedCity.name === 'Mumbai') {
          metrics.temperature = 30;
          metrics.humidity = 70;
          metrics.aqi = 60;
          metrics.tips = [
            'Coastal flooding is a concern during monsoons. Stay updated on weather alerts.'
          ];
        } else if (selectedCity.name === 'Bengaluru') {
          metrics.temperature = 28;
          metrics.humidity = 60;
          metrics.aqi = 40;
          metrics.tips = [
            'Traffic congestion is common. Use public transport when possible.'
          ];
        } else {
          metrics.tips = [metrics.tips || 'No tips available.'];
        }
      } else {
        // Ensure tips is always an array
        if (typeof metrics.tips === 'string') metrics.tips = [metrics.tips];
        if (!Array.isArray(metrics.tips)) metrics.tips = [metrics.tips || 'No tips available.'];
      }
      setCityMetrics(metrics);
      // Log full metrics from state
      console.log('[CityPulse] Dashboard cityMetrics:', metrics);
    });
  }, [selectedCity]);

  // AI summary effect
  useEffect(() => {
    async function fetchSummary() {
      setIsLoading(true);
      try {
        // Compose summary for all active categories
        const activeCategories = Array.from(new Set(filteredReports.map(r => r.category)));
        let summaryText = '';
        if (activeCategories.length > 1) {
          summaryText = activeCategories.map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)).join(' and ');
          summaryText += ' issues detected in selected region.';
        }
        const summary = await geminiService.analyzeTextReport(
          filteredReports.map(r => r.description).join(' '),
          selectedCategory !== 'all' ? selectedCategory : (activeCategories[0] || 'traffic')
        );
        // Fallback AI summary logic
        let fallbackSummary = '';
        if (!summary || !summary.summary) {
          if (summaryText) {
            fallbackSummary = summaryText;
          } else if (cityMetrics && cityMetrics.aqi > 150) {
            fallbackSummary = 'Air quality is poor today. Mask recommended.';
          } else if (cityMetrics && cityMetrics.temperature > 35) {
            fallbackSummary = 'Heatwave conditions. Stay indoors during peak hours.';
          } else if (filteredReports.filter(r => r.category === 'Traffic' || r.category === 'Power').length > 2) {
            fallbackSummary = 'Heavy urban load; commute and power interruptions expected.';
          } else {
            fallbackSummary = 'Urban conditions are stable.';
          }
          setAiSummary(fallbackSummary);
        } else {
          // If multiple categories, prepend detected issues
          if (summaryText) {
            setAiSummary(summaryText + ' ' + summary.summary.charAt(0).toLowerCase() + summary.summary.slice(1));
          } else {
            setAiSummary(summary.summary);
          }
        }
      } catch (e) {
        // Fallback AI summary logic
        let fallbackSummary = '';
        const activeCategories = Array.from(new Set(filteredReports.map(r => r.category)));
        let summaryText = '';
        if (activeCategories.length > 1) {
          summaryText = activeCategories.map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)).join(' and ');
          summaryText += ' issues detected in selected region.';
        }
        if (summaryText) {
          fallbackSummary = summaryText;
        } else if (cityMetrics && cityMetrics.aqi > 150) {
          fallbackSummary = 'Air quality is poor today. Mask recommended.';
        } else if (cityMetrics && cityMetrics.temperature > 35) {
          fallbackSummary = 'Heatwave conditions. Stay indoors during peak hours.';
        } else if (filteredReports.filter(r => r.category === 'Traffic' || r.category === 'Power').length > 2) {
          fallbackSummary = 'Heavy urban load; commute and power interruptions expected.';
        } else {
          fallbackSummary = 'Urban conditions are stable.';
        }
        setAiSummary(fallbackSummary);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSummary();
  }, [filteredReports, selectedCategory, cityMetrics]);

  // Filter reports based on selected criteria
  useEffect(() => {
    let filtered = reports;
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(report => report.category === selectedCategory);
    }
    if (selectedCity) {
      filtered = filtered.filter(report => report.city === selectedCity.name);
    }
    // Fallback: If no reports, inject robust mock reports for demo
    if (filtered.length === 0) {
      filtered = robustMockReports.filter(r => r.city === selectedCity.name);
    }
    setFilteredReports(filtered);
  }, [reports, selectedCategory, selectedCity]);

  const handleReportClick = (report) => {
    setSelectedReport(report);
  };

  const clearFilters = () => {
    setSelectedCategory('all');
  };

  // Export data as CSV (simple mock)
  const handleExportCSV = () => {
    setExporting(true);
    const csv = [
      ['Title', 'Category', 'Severity', 'Address', 'Status', 'Timestamp'],
      ...filteredReports.map(r => [r.title, r.category, r.severity, r.address, r.status, r.timestamp])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dashboard_reports.csv';
    a.click();
    setTimeout(() => setExporting(false), 1000);
  };

  // Chart data
  const categoryCounts = categories.map(cat => ({
    name: cat.name,
    count: reports.filter(r => r.category === cat.id && r.city === selectedCity.name).length
  }));
  const severityCounts = [
    { name: 'High', count: reports.filter(r => r.severity === 'high' && r.city === selectedCity.name).length },
    { name: 'Medium', count: reports.filter(r => r.severity === 'medium' && r.city === selectedCity.name).length },
    { name: 'Low', count: reports.filter(r => r.severity === 'low' && r.city === selectedCity.name).length }
  ];

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Live Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Real-time urban intelligence and incident tracking
              </p>
            </div>
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
          </div>
        </div>
      </div>

      {/* City Metrics & Tips */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1 flex flex-wrap gap-4 items-center">
            {cityMetrics === null ? (
              <div className="flex items-center gap-2 text-gray-500 animate-pulse">
                <svg className="animate-spin h-5 w-5 mr-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                Fetching metrics...
              </div>
            ) : (
              <>
                <div className="card text-center p-4 min-w-[120px]">
                  <div className="text-xs text-gray-500">AQI</div>
                  <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                    {typeof cityMetrics.aqi === 'number' ? (
                      <span className="text-yellow-600 dark:text-yellow-400">{cityMetrics.aqi}</span>
                    ) : (
                      <span className="text-gray-400 italic opacity-70" title="Live data not available for this city right now.">N/A</span>
                    )}
                  </div>
                  <div className="text-xs italic text-gray-400 mt-1">
                    *Data fetched from AQICN API (may vary from CPCB official readings)*
                  </div>
                </div>
                <div className="card text-center p-4 min-w-[120px]">
                  <div className="text-xs text-gray-500">Temp (°C)</div>
                  <div className="text-lg font-bold text-red-600 dark:text-red-400">
                    {typeof cityMetrics.temperature === 'number' ? (
                      <span className="text-red-600 dark:text-red-400">{cityMetrics.temperature}</span>
                    ) : (
                      <span className="text-gray-400 italic opacity-70" title="Live data not available for this city right now.">N/A</span>
                    )}
                  </div>
                </div>
                <div className="card text-center p-4 min-w-[120px]">
                  <div className="text-xs text-gray-500">Humidity (%)</div>
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    {typeof cityMetrics.humidity === 'number' ? (
                      <span className="text-green-600 dark:text-green-400">{cityMetrics.humidity}</span>
                    ) : (
                      <span className="text-gray-400 italic opacity-70" title="Live data not available for this city right now.">N/A</span>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="flex-1">
            {cityMetrics && cityMetrics.tips && cityMetrics.tips.length > 0 && (
              <div className="card bg-blue-50 dark:bg-blue-900/20 p-4 text-sm text-blue-900 dark:text-blue-100">
                <span className="font-semibold">Smart Tip:</span> {cityMetrics.tips.map((tip, i) => <span key={i}>{tip}{i < cityMetrics.tips.length - 1 ? ' ' : ''}</span>)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Summary & Export */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <SparklesIcon className="h-5 w-5 text-blue-500" />
              <span className="font-semibold text-gray-900 dark:text-white">AI Summary</span>
            </div>
            <div className="text-gray-700 dark:text-gray-300 text-sm max-w-2xl">
              {isLoading ? <span className="animate-pulse">Generating summary...</span> : aiSummary}
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
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <FunnelIcon className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Filters:
              </span>
            </div>
            <div className="flex flex-wrap items-center space-x-4">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field text-sm max-w-xs"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="card h-96 lg:h-[600px] p-0 overflow-hidden"
            >
              <MapComponent
                reports={filteredReports}
                city={selectedCity}
                onMarkerClick={handleReportClick}
                selectedReport={selectedReport}
                showWeather={true}
                showAQI={true}
              />
            </motion.div>
          </div>

          {/* Reports List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Reports
              </h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {filteredReports.length} items
              </div>
            </div>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {filteredReports.length > 0 ? (
                filteredReports.map((report, idx) => (
                  <motion.div
                    key={report.id || report.timestamp + '-' + idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ReportCard
                      report={report}
                      isSelected={selectedReport?.id === report.id}
                      onClick={() => handleReportClick(report)}
                    />
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <InformationCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No reports found with current filters
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Statistics & Charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          {/* Metric Cards */}
          <div className="card text-center">
            <div className="flex justify-center mb-2"><ChartBarIcon className="h-6 w-6 text-blue-500" /></div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {filteredReports.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Total Events
            </div>
          </div>
          <div className="card text-center">
            <div className="flex justify-center mb-2"><ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" /></div>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {filteredReports.filter(r => r.severity === 'high').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Alerts Detected
            </div>
          </div>
          <div className="card text-center">
            <div className="flex justify-center mb-2"><ChartPieIcon className="h-6 w-6 text-purple-500" /></div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {categoryCounts.reduce((acc, c) => acc + c.count, 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Categorized Reports
            </div>
          </div>
          <div className="card text-center">
            <div className="flex justify-center mb-2"><ChartBarIcon className="h-6 w-6 text-green-500" /></div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {severityCounts[0].count}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Power Failures
            </div>
          </div>
        </motion.div>

        {/* Simple Bar Chart (Categories) */}
        <div className="mt-8 card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center"><ChartBarIcon className="h-5 w-5 mr-2 text-blue-500" /> Reports by Category</h3>
          <div className="flex items-end gap-4 h-40">
            {categoryCounts.map(cat => (
              <div key={cat.name} className="flex-1 flex flex-col items-center">
                <div className={`w-8 rounded-t-lg transition-all duration-300 ${cat.count > 0 ? 'bg-blue-500 dark:bg-blue-400' : 'bg-gray-200 dark:bg-gray-700'}`} style={{ height: `${cat.count * 10 + 10}px` }}></div>
                <span className="mt-2 text-xs text-gray-700 dark:text-gray-300">{cat.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{cat.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Simple Pie Chart (Severity) */}
        <div className="mt-8 card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center"><ChartPieIcon className="h-5 w-5 mr-2 text-purple-500" /> Reports by Severity</h3>
          <div className="flex gap-8 items-center justify-center">
            {severityCounts.map((sev, idx) => (
              <div key={sev.name} className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${idx === 0 ? 'bg-red-500' : idx === 1 ? 'bg-yellow-500' : 'bg-green-500'} bg-opacity-80 text-white font-bold text-lg`}>
                  {sev.count}
                </div>
                <span className="text-xs text-gray-700 dark:text-gray-300">{sev.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 