import { geminiService } from '../services/geminiService';

/**
 * Analyze sentiment and emotion from social posts by location
 * @param {Array} posts - Array of { text, location }
 * @returns {Promise<Array>} moodMapData - [{ location, sentiment, emotion, count }]
 */
export async function analyzeSentimentByLocation(posts) {
  if (!Array.isArray(posts) || posts.length === 0) return [];

  // Group posts by location
  const grouped = {};
  posts.forEach(post => {
    const loc = post.location || 'Unknown';
    if (!grouped[loc]) grouped[loc] = [];
    grouped[loc].push(post.text);
  });

  // For each location, analyze sentiment and emotion
  const moodMapData = await Promise.all(
    Object.entries(grouped).map(async ([location, texts]) => {
      // Aggregate all text for the location
      const combinedText = texts.join(' ');
      // Use Gemini to analyze sentiment
      const sentimentLabel = await geminiService.analyzeSentiment(combinedText);
      // Mock emotion extraction based on sentiment (for demo)
      let emotion = 'Neutral';
      if (sentimentLabel === 'Positive') emotion = 'Happy';
      else if (sentimentLabel === 'Negative') emotion = 'Frustrated';
      else if (sentimentLabel === 'Frustrated') emotion = 'Frustrated';
      else if (sentimentLabel === 'Concerned') emotion = 'Concerned';
      else if (sentimentLabel === 'Cautious') emotion = 'Cautious';
      // Count of posts
      return {
        location,
        sentiment: sentimentLabel,
        emotion,
        count: texts.length
      };
    })
  );
  return moodMapData;
} 