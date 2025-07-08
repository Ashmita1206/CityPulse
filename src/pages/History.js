import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ClockIcon, 
  DocumentTextIcon, 
  ArrowDownTrayIcon,
  TrashIcon,
  EyeIcon,
  CalendarIcon,
  ChartBarIcon,
  ChartPieIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { mockReports } from '../data/mockData';
import toast from 'react-hot-toast';
import { geminiService } from '../services/geminiService';

const History = () => {
  const [reports, setReports] = useState(mockReports);
  const [selectedTab, setSelectedTab] = useState('reports');
  const [selectedReports, setSelectedReports] = useState([]);
  const [aiSummary, setAiSummary] = useState('');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    async function fetchSummary() {
      const summary = await geminiService.analyzeTextReport(
        reports.map(r => r.description).join(' '),
        'traffic'
      );
      setAiSummary(summary.summary);
    }
    fetchSummary();
  }, [reports]);

  const tabs = [
    { id: 'reports', name: 'My Reports', icon: DocumentTextIcon },
    { id: 'saved', name: 'Saved Items', icon: EyeIcon },
    { id: 'downloads', name: 'Downloads', icon: ArrowDownTrayIcon }
  ];

  const handleReportSelect = (reportId) => {
    setSelectedReports(prev => 
      prev.includes(reportId)
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  const handleDeleteReports = () => {
    if (selectedReports.length === 0) {
      toast.error('Please select reports to delete');
      return;
    }

    setReports(prev => prev.filter(report => !selectedReports.includes(report.id)));
    setSelectedReports([]);
    toast.success(`${selectedReports.length} reports deleted`);
  };

  const handleDownloadPDF = async (report) => {
    try {
      toast.loading('Generating PDF...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download PDF');
    }
  };

  const handleExportCSV = () => {
    setExporting(true);
    const csv = [
      ['Title', 'Category', 'Severity', 'Address', 'Status', 'Timestamp'],
      ...reports.map(r => [r.title, r.category, r.severity, r.address, r.status, r.timestamp])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'history_reports.csv';
    a.click();
    setTimeout(() => setExporting(false), 1000);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      traffic: '\ud83d\ude97',
      civic: '\ud83c\udfdb\ufe0f',
      power: '\u26a1',
      weather: '\ud83c\udf27\ufe0f'
    };
    return icons[category] || '\ud83d\udccd';
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'text-red-600 dark:text-red-400';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'low':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  // Chart data
  const categoryCounts = ['traffic','civic','power','weather'].map(cat => ({
    name: cat.charAt(0).toUpperCase() + cat.slice(1),
    count: reports.filter(r => r.category === cat).length
  }));
  const severityCounts = [
    { name: 'High', count: reports.filter(r => r.severity === 'high').length },
    { name: 'Medium', count: reports.filter(r => r.severity === 'medium').length },
    { name: 'Low', count: reports.filter(r => r.severity === 'low').length }
  ];

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              My History
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              View your submitted reports, saved items, and download history
            </p>
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
                {reports.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Total Reports
              </div>
            </div>
            <div className="card text-center">
              <div className="flex justify-center mb-2"><TrashIcon className="h-6 w-6 text-red-500" /></div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {selectedReports.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Selected for Deletion
              </div>
            </div>
            <div className="card text-center">
              <div className="flex justify-center mb-2"><ArrowDownTrayIcon className="h-6 w-6 text-green-500" /></div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {reports.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Downloadable
              </div>
            </div>
            <div className="card text-center">
              <div className="flex justify-center mb-2"><ChartPieIcon className="h-6 w-6 text-purple-500" /></div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {categoryCounts.reduce((acc, c) => acc + c.count, 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Categorized
              </div>
            </div>
          </motion.div>

          {/* Simple Bar Chart (Categories) */}
          <div className="mb-8 card p-6">
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
          <div className="mb-8 card p-6">
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

          {/* Tabs */}
          <div className="card mb-6">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      selectedTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          {selectedTab === 'reports' && (
            <div className="space-y-6">
              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {reports.length} reports
                  </span>
                  {selectedReports.length > 0 && (
                    <span className="text-sm text-blue-600 dark:text-blue-400">
                      {selectedReports.length} selected
                    </span>
                  )}
                </div>
                
                {selectedReports.length > 0 && (
                  <button
                    onClick={handleDeleteReports}
                    className="btn-secondary text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Delete Selected
                  </button>
                )}
              </div>

              {/* Reports List */}
              <div className="space-y-4">
                {reports.map((report) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-start space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedReports.includes(report.id)}
                        onChange={() => handleReportSelect(report.id)}
                        className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{getCategoryIcon(report.category)}</span>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {report.title}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {report.address}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${getSeverityColor(report.severity)} bg-gray-100 dark:bg-gray-700`}>
                              {report.severity}
                            </span>
                                                         <button
                               onClick={() => handleDownloadPDF(report)}
                               className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                             >
                               <ArrowDownTrayIcon className="h-4 w-4" />
                             </button>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                          {report.aiSummary}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <CalendarIcon className="h-3 w-3" />
                              <span>{formatDate(report.timestamp)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <ClockIcon className="h-3 w-3" />
                              <span>{report.status}</span>
                            </div>
                          </div>
                          
                          {report.media && (
                            <span className="text-blue-600 dark:text-blue-400">
                              \ud83d\udcce Has media
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'saved' && (
            <div className="text-center py-12">
              <EyeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No saved items yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Save interesting reports and dashboards to view them later
              </p>
            </div>
          )}

                     {selectedTab === 'downloads' && (
             <div className="text-center py-12">
               <ArrowDownTrayIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
               <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                 No downloads yet
               </h3>
               <p className="text-gray-500 dark:text-gray-400">
                 Download PDF reports and summaries to keep them offline
               </p>
             </div>
           )}
        </motion.div>
      </div>
    </div>
  );
};

export default History; 