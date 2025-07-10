import { geminiService } from '../services/geminiService';

/**
 * Generate personalized notifications for a user
 * @param {Array} reports
 * @param {Object} userPreferences { locations: [], tags: [] }
 * @returns {Promise<Array>} [{ title, message, timestamp, type }]
 */
export async function generateNotifications(reports, userPreferences) {
  const { locations = [], tags = [] } = userPreferences || {};
  // Filter reports by user preferences
  const filtered = reports.filter(r => {
    const locMatch = !locations.length || locations.includes(r.location?.city || r.location?.area || r.location || r.city);
    const tagMatch = !tags.length || tags.includes(r.aiTag || r.category);
    return locMatch && tagMatch;
  });
  // Group by tag
  const grouped = {};
  filtered.forEach(r => {
    const tag = r.aiTag || r.category || 'General';
    if (!grouped[tag]) grouped[tag] = [];
    grouped[tag].push(r);
  });
  // For each group, generate a summary notification
  const notifications = await Promise.all(
    Object.entries(grouped).map(async ([tag, group]) => {
      const descriptions = group.map(r => r.description).join(' ');
      const ai = await geminiService.summarizeReports(descriptions, tag);
      return {
        title: `Update: ${tag}`,
        message: ai.summary || `Recent activity for ${tag}`,
        timestamp: new Date().toISOString(),
        type: tag,
      };
    })
  );
  return notifications;
} 