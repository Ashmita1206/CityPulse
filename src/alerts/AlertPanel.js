import React from 'react';

const iconMap = {
  Traffic: '🚦',
  Power: '⚡',
  Weather: '🌧️',
  Civic: '🏛️',
  General: '🔔',
};

const AlertPanel = ({ alerts = [] }) => {
  if (!alerts.length) {
    return <div className="text-gray-400 text-center">No predictive alerts at this time.</div>;
  }
  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {alerts.map((alert, idx) => (
        <div key={idx} className="bg-white rounded-lg shadow p-4 flex items-center border-l-4 border-blue-500">
          <div className="text-3xl mr-4">{iconMap[alert.type] || iconMap.General}</div>
          <div className="flex-1">
            <div className="flex items-center mb-1">
              <span className="font-semibold text-blue-700 mr-2">{alert.type || 'Alert'}</span>
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full mr-2">{alert.area}</span>
              {alert.probability && (
                <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">{Math.round(alert.probability * 100)}% chance</span>
              )}
            </div>
            <div className="text-gray-800 mb-1">{alert.message}</div>
            <div className="text-xs text-gray-500">{alert.impact} • {new Date(alert.timestamp).toLocaleString()}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlertPanel; 