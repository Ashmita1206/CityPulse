import { geminiService } from '../services/geminiService';

/**
 * Summarize recent activity in a given area
 * @param {Array} reports
 * @param {string} area
 * @returns {Promise<{ area, summary, topIssues, moodTrend, predictiveAlerts }>} 
 */
export async function summarizeArea(reports, area) {
  const areaReports = reports.filter(r => {
    const loc = r.location?.city || r.location?.area || r.location || r.city;
    return loc === area;
  });
  const descriptions = areaReports.map(r => r.description).join(' ');
  const ai = await geminiService.summarizeReports(descriptions, null, area);
  // Mock mood and predictive alerts for demo
  const moodTrend = 'Neutral';
  const predictiveAlerts = [
    { type: 'Traffic', message: 'Possible congestion in next 2 hours' },
    { type: 'Weather', message: 'Rain expected this evening' },
  ];
  return {
    area,
    summary: ai.summary || `Recent activity in ${area}`,
    topIssues: ai.topIssues || [],
    moodTrend,
    predictiveAlerts,
  };
} 