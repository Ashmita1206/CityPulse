import { geminiService } from '../services/geminiService';

// Helper: group by area, tag, and time window (last 30 min)
function groupReports(reports) {
  const now = Date.now();
  const THIRTY_MIN = 30 * 60 * 1000;
  const groups = {};
  reports.forEach((r) => {
    const area = r.location?.area || r.location?.city || r.city || 'Unknown';
    const tag = r.aiTag || r.category || 'General';
    const time = new Date(r.timestamp).getTime();
    if (now - time > THIRTY_MIN) return; // Only last 30 min
    const key = `${area}|${tag}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(r);
  });
  return Object.entries(groups).map(([key, reports]) => {
    const [area, tag] = key.split('|');
    return { area, tag, reports };
  });
}

/**
 * synthesizeEvents: Fuse similar reports into AI-synthesized event summaries
 * @param {Array} reports
 * @returns {Promise<Array>} [{ area, tag, summary, count, severity }]
 */
export async function synthesizeEvents(reports) {
  const groups = groupReports(reports);
  const results = await Promise.all(
    groups.map(async ({ area, tag, reports }) => {
      const descriptions = reports.map(r => r.description).join(' ');
      // Call Gemini to synthesize
      const ai = await geminiService.summarizeReports(descriptions, tag, area);
      return {
        area,
        tag,
        summary: ai.summary || `Clustered event: ${tag} in ${area}`,
        count: reports.length,
        severity: ai.severity || 'Medium',
      };
    })
  );
  return results;
} 