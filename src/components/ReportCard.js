import React from 'react';
import { ClockIcon, MapPinIcon } from '@heroicons/react/24/outline';

const ReportCard = ({ report, isSelected, onClick }) => {
  const getCategoryIcon = (category) => {
    const icons = {
      traffic: '🚗',
      civic: '🏛️',
      power: '⚡',
      weather: '🌧️'
    };
    return icons[category] || '📍';
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low':
        return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      default:
        return 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800';
    }
  };

  const getSeverityTextColor = (severity) => {
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

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    }
  };

  return (
    <div
      onClick={onClick}
      className={`card cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected 
          ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' 
          : 'hover:bg-gray-50 dark:hover:bg-gray-800'
      } ${getSeverityColor(report.severity)}`}
    >
      <div className="flex items-start space-x-3">
        <div className="text-2xl">{getCategoryIcon(report.category)}</div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {report.title}
            </h3>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${getSeverityTextColor(report.severity)} bg-white dark:bg-gray-700`}>
              {report.severity}
            </span>
          </div>
          
          <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
            {report.aiSummary}
          </p>
          
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <MapPinIcon className="h-3 w-3" />
              <span className="truncate">{report.address}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ClockIcon className="h-3 w-3" />
              <span>{formatTime(report.timestamp)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCard; 