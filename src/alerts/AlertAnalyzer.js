import { geminiService } from '../services/geminiService';

/**
 * Analyze reports and generate predictive alerts using Gemini AI
 * @param {Array} reports - Array of report objects (with at least category, location, timestamp)
 * @returns {Promise<Array>} - Array of alert objects
 */
export async function analyzeAlerts(reports) {
  if (!Array.isArray(reports) || reports.length === 0) return [];

  // Group by category and location (simple spike detection)
  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;
  const grouped = {};
  reports.forEach(r => {
    const key = `${r.category || r.aiTag || 'General'}|${r.location || r.city || 'Unknown'}`;
    if (!grouped[key]) grouped[key] = [];
    // Only consider recent reports (last 1hr)
    if (new Date(r.timestamp).getTime() > oneHourAgo) {
      grouped[key].push(r);
    }
  });

  // Prepare data for AI
  const spikes = Object.entries(grouped)
    .filter(([_, arr]) => arr.length >= 3) // threshold: 3+ similar reports
    .map(([key, arr]) => ({
      key,
      count: arr.length,
      sample: arr[0],
      reports: arr
    }));

  if (spikes.length === 0) return [];

  // Use Gemini to generate alerts
  const aiResults = await geminiService.generatePredictions(spikes);
  // Fallback: If Gemini returns nothing, create simple alerts
  if (!aiResults || !aiResults.alerts) {
    return spikes.map(spike => ({
      type: spike.sample.category || spike.sample.aiTag || 'General',
      area: spike.sample.location || spike.sample.city || 'Unknown',
      message: `Spike: ${spike.count} reports of ${spike.sample.category || spike.sample.aiTag} in ${spike.sample.location || spike.sample.city}`,
      timestamp: new Date().toISOString(),
      impact: 'Potential issue detected',
    }));
  }
  // Map Gemini alerts to our format
  return aiResults.alerts.map(alert => ({
    type: alert.type,
    area: alert.area,
    message: alert.message,
    timestamp: new Date().toISOString(),
    impact: alert.timeframe || 'Predicted',
    probability: alert.probability
  }));
} 