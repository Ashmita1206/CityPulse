import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { 
  CameraIcon, 
  SparklesIcon,
  XMarkIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';
import { geminiService } from '../services/geminiService';
import { categories } from '../data/mockData';
import toast from 'react-hot-toast';
import { fetchCityMetrics } from '../services/cityMetricsService';
import indianCities from '../data/indianCities';

// CSVPreview component for CSV file preview
function CSVPreview({ file }) {
  const [csvPreview, setCsvPreview] = useState('');
  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      setCsvPreview(text.split('\n').slice(0, 5).join('\n'));
    };
    reader.readAsText(file);
  }, [file]);
  return (
    <pre className="bg-gray-100 dark:bg-gray-800 rounded p-2 text-xs overflow-x-auto mt-2">{csvPreview}</pre>
  );
}

const Report = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    severity: 'medium',
    location: '',
    address: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [cityMetrics, setCityMetrics] = useState(null);
  // Remove setSelectedCity from useState if unused
  const [selectedCity] = useState(indianCities[0]);

  useEffect(() => {
    setCityMetrics(null);
    fetchCityMetrics(selectedCity.name).then(metrics => {
      console.log('[CityPulse] Report cityMetrics:', metrics);
      setCityMetrics(metrics);
    });
  }, [selectedCity]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'video/*': ['.mp4', '.avi', '.mov'],
      'text/csv': ['.csv']
    },
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: (acceptedFiles) => {
      setUploadedFiles(prev => [...prev, ...acceptedFiles]);
    }
  });

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const analyzeWithAI = async () => {
    if (!formData.description && uploadedFiles.length === 0) {
      toast.error('Please provide a description or upload media for AI analysis');
      return;
    }
    setIsAnalyzing(true);
    setUploadProgress(0);
    try {
      let analysis = null;
      if (uploadedFiles.length > 0) {
        // Simulate upload progress
        for (let i = 1; i <= 10; i++) {
          setUploadProgress(i * 10);
          await new Promise(res => setTimeout(res, 60));
        }
        // Analyze media files
        const mediaAnalysis = await Promise.all(
          uploadedFiles.map(file => 
            geminiService.analyzeMedia(file, formData.description)
          )
        );
        analysis = mediaAnalysis[0];
      } else {
        analysis = await geminiService.analyzeTextReport(
          formData.description, 
          formData.category
        );
      }
      setAiAnalysis(analysis);
      toast.success('AI analysis completed!');
    } catch (error) {
      console.error('AI analysis error:', error);
      toast.error('Failed to analyze with AI. Please try again.');
    } finally {
      setIsAnalyzing(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Report submitted successfully!');
      setFormData({
        title: '',
        description: '',
        category: '',
        severity: 'medium',
        location: '',
        address: ''
      });
      setUploadedFiles([]);
      setAiAnalysis(null);
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Report an Incident
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Help your community by reporting incidents. Our AI will analyze your submission 
              and provide insights to help others.
            </p>
          </div>

          {cityMetrics && (
            <div className="card mb-6 flex flex-wrap gap-4 items-center justify-center">
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
                  {cityMetrics.humidity === 'N/A' || cityMetrics.humidity === 'Data not available' ? (
                    <span className="text-gray-400 italic opacity-70" title="Live data not available for this city right now.">{cityMetrics.humidity}</span>
                  ) : (
                    <span>{cityMetrics.humidity}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Basic Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Brief description of the incident"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="input-field"
                  placeholder="Provide detailed information about the incident..."
                  required
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Severity
                  </label>
                  <select
                    name="severity"
                    value={formData.severity}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Address or area"
                  />
                </div>
              </div>
            </div>

            {/* Media Upload */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Media/CSV Upload (Optional)
              </h2>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ${
                  isDragActive
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
                }`}
              >
                <input {...getInputProps()} />
                <CameraIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  {isDragActive
                    ? 'Drop files here...'
                    : 'Drag & drop photos/videos/CSV here, or click to select'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Supports: JPG, PNG, GIF, MP4, CSV (max 10MB each)
                </p>
              </div>
              {/* Upload Progress */}
              {isAnalyzing && uploadProgress > 0 && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Uploaded Files ({uploadedFiles.length})
                  </h3>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <CloudArrowUpIcon className="h-5 w-5 text-green-500" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {file.name}
                          </span>
                          {file.type === 'text/csv' && <CSVPreview file={file} />}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* AI Analysis */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  AI Analysis
                </h2>
                <button
                  type="button"
                  onClick={analyzeWithAI}
                  disabled={isAnalyzing || (!formData.description && uploadedFiles.length === 0)}
                  className="btn-primary inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SparklesIcon className="h-4 w-4 mr-2" />
                  {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
                </button>
              </div>
              {aiAnalysis && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4"
                >
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    AI Insights
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Summary:</strong> {aiAnalysis.summary}</p>
                    {aiAnalysis.prediction && (
                      <p><strong>Prediction:</strong> {aiAnalysis.prediction}</p>
                    )}
                    {aiAnalysis.sentiment && (
                      <p><strong>Sentiment:</strong> {aiAnalysis.sentiment}</p>
                    )}
                    {aiAnalysis.recommendations && (
                      <div>
                        <strong>Recommendations:</strong>
                        <ul className="list-disc list-inside mt-1">
                          {aiAnalysis.recommendations.map((rec, index) => (
                            <li key={index}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary text-lg px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="loading-spinner mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  'Submit Report'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Report; 