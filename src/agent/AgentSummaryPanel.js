import React, { useEffect, useState } from 'react';
import { geminiService } from '../services/geminiService';

/**
 * AgentSummaryPanel
 * Props:
 *   cityName: string
 *   cityMetrics: { aqi, temperature, humidity, population, tips }
 *   reports: array of report objects (with at least description, category)
 */
const AgentSummaryPanel = ({ cityName, cityMetrics, reports }) => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchSummary() {
      setLoading(true);
      try {
        // Compose a text blob from reports and metrics
        const reportText = reports && reports.length > 0
          ? reports.map(r => r.description).join(' ')
          : '';
        const category = reports && reports.length > 0
          ? reports[0].category.toLowerCase()
          : 'traffic';
        // Optionally, include metrics in the prompt
        const metricsText = cityMetrics
          ? `AQI: ${cityMetrics.aqi}, Temp: ${cityMetrics.temperature}°C, Humidity: ${cityMetrics.humidity}%, Population: ${cityMetrics.population}`
          : '';
        const prompt = `${cityName} update. ${metricsText}. ${reportText}`;
        const aiResult = await geminiService.analyzeTextReport(prompt, category);
        setSummary(aiResult.summary || 'No summary available.');
      } catch (e) {
        setSummary('Unable to generate summary at this time.');
      } finally {
        setLoading(false);
      }
    }
    if (cityName && cityMetrics) fetchSummary();
  }, [cityName, cityMetrics, reports]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-200">
      <div className="flex items-center mb-2">
        <span className="text-lg font-semibold text-blue-700 mr-2">AI City Summary</span>
        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Agentic</span>
      </div>
      {loading ? (
        <div className="text-gray-400 animate-pulse">Generating summary...</div>
      ) : (
        <div className="text-gray-700 text-base">{summary}</div>
      )}
    </div>
  );
};

export default AgentSummaryPanel; 