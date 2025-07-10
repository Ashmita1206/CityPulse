import { geminiService } from '../services/geminiService';

/**
 * Generate email digest for a city
 * @param {Array} reports - Array of reports
 * @param {string} city - City name
 * @returns {Promise<Object>} Digest object
 */
export async function generateDigest(reports, city) {
  try {
    // Filter reports for the specific city
    const cityReports = reports.filter(r => 
      r.location?.city === city || r.location?.area === city || r.city === city
    );

    if (cityReports.length === 0) {
      return {
        city,
        summary: `No recent activity in ${city}`,
        topEvents: [],
        moodTrend: 'Neutral',
        keyAlerts: [],
        reportCount: 0,
      };
    }

    // Prepare data for AI analysis
    const descriptions = cityReports.map(r => r.description).join('. ');
    const categories = Array.from(new Set(cityReports.map(r => r.aiTag || r.category)));
    
    const prompt = `Generate a city digest for ${city} based on:
      Reports: ${descriptions}
      Categories: ${categories.join(', ')}
      
      Provide:
      1. A concise summary of recent activity
      2. Top 3 events/issues
      3. Overall mood trend
      4. Key alerts or warnings`;

    const aiResponse = await geminiService.analyzeTextReport(prompt, 'general');

    // Mock mood analysis
    const moodTrends = ['Positive', 'Neutral', 'Concerned', 'Frustrated'];
    const moodTrend = moodTrends[Math.floor(Math.random() * moodTrends.length)];

    // Mock alerts based on report count
    const keyAlerts = [];
    if (cityReports.length > 5) {
      keyAlerts.push('High report volume detected');
    }
    if (categories.includes('Traffic')) {
      keyAlerts.push('Traffic congestion reported');
    }
    if (categories.includes('Power')) {
      keyAlerts.push('Power issues in the area');
    }

    return {
      city,
      summary: aiResponse.summary || `Recent activity summary for ${city}`,
      topEvents: aiResponse.recommendations?.slice(0, 3) || ['Event 1', 'Event 2', 'Event 3'],
      moodTrend,
      keyAlerts,
      reportCount: cityReports.length,
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Digest generation failed:', error);
    return {
      city,
      summary: `Unable to generate digest for ${city}`,
      topEvents: [],
      moodTrend: 'Unknown',
      keyAlerts: [],
      reportCount: 0,
      error: true,
    };
  }
}

/**
 * Generate digest for multiple cities
 * @param {Array} reports - Array of reports
 * @param {Array} cities - Array of city names
 * @returns {Promise<Array>} Array of digest objects
 */
export async function generateMultiCityDigest(reports, cities) {
  const digests = await Promise.all(
    cities.map(city => generateDigest(reports, city))
  );
  return digests;
} 