import React, { useEffect, useState } from 'react';
import { analyzeAlerts } from '../alerts/AlertAnalyzer';
import AlertPanel from '../alerts/AlertPanel';

const mockReports = [
  { category: 'Traffic', location: 'Delhi', timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString() },
  { category: 'Traffic', location: 'Delhi', timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString() },
  { category: 'Traffic', location: 'Delhi', timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
  { category: 'Power', location: 'Mumbai', timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
  { category: 'Power', location: 'Mumbai', timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString() },
  { category: 'Power', location: 'Mumbai', timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString() },
  { category: 'Weather', location: 'Bangalore', timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
];

const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAlerts() {
      setLoading(true);
      const data = await analyzeAlerts(mockReports);
      setAlerts(data);
      setLoading(false);
    }
    fetchAlerts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-red-700 mb-6 text-center">🚨 CityPulse Predictive Alerts</h1>
        {loading ? (
          <div className="text-center text-gray-400">Analyzing reports...</div>
        ) : (
          <AlertPanel alerts={alerts} />
        )}
      </div>
    </div>
  );
};

export default AlertsPage; 