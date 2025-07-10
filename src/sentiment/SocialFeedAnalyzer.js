import { geminiService } from '../services/geminiService';

// Mock social media posts
const mockSocialPosts = [
  { text: "Traffic in Delhi is unbearable today! 😤", city: "Delhi", timestamp: "2024-07-09T10:00:00Z" },
  { text: "Beautiful weather in Bangalore today ☀️", city: "Bangalore", timestamp: "2024-07-09T11:00:00Z" },
  { text: "Power cut in Mumbai again. This is getting ridiculous!", city: "Mumbai", timestamp: "2024-07-09T12:00:00Z" },
  { text: "Great food festival happening in Jaipur! 🍽️", city: "Jaipur", timestamp: "2024-07-09T13:00:00Z" },
  { text: "Air quality in Delhi is so bad today 😷", city: "Delhi", timestamp: "2024-07-09T14:00:00Z" },
  { text: "Amazing metro service in Bangalore! 🚇", city: "Bangalore", timestamp: "2024-07-09T15:00:00Z" },
  { text: "Waterlogging in Mumbai after heavy rain", city: "Mumbai", timestamp: "2024-07-09T16:00:00Z" },
  { text: "Traffic police doing great work in Chennai 👍", city: "Chennai", timestamp: "2024-07-09T17:00:00Z" },
];

/**
 * Analyze social media posts for sentiment and topics
 * @param {Array} posts - Array of social posts
 * @returns {Promise<Array>} Analyzed posts with sentiment and topics
 */
export async function analyzeSocialFeed(posts = mockSocialPosts) {
  try {
    const analyzedPosts = await Promise.all(
      posts.map(async (post) => {
        try {
          // Use Gemini to analyze sentiment and extract topic
          const analysis = await geminiService.analyzeSentiment(post.text);
          
          // Extract topic from text (simple keyword matching for demo)
          const topics = extractTopics(post.text);
          
          return {
            ...post,
            sentiment: analysis,
            topics,
            analyzed: true,
          };
        } catch (error) {
          // Fallback analysis
          return {
            ...post,
            sentiment: 'Neutral',
            topics: ['General'],
            analyzed: false,
          };
        }
      })
    );

    return analyzedPosts;
  } catch (error) {
    console.error('Social feed analysis failed:', error);
    return posts.map(post => ({
      ...post,
      sentiment: 'Neutral',
      topics: ['General'],
      analyzed: false,
    }));
  }
}

/**
 * Extract topics from social media text
 * @param {string} text - Social media post text
 * @returns {Array} Array of topics
 */
function extractTopics(text) {
  const lowerText = text.toLowerCase();
  const topics = [];

  // Topic keywords
  const topicKeywords = {
    'Traffic': ['traffic', 'congestion', 'jam', 'road'],
    'Weather': ['weather', 'rain', 'sunny', 'hot', 'cold'],
    'Power': ['power', 'electricity', 'outage', 'cut'],
    'Air Quality': ['air', 'pollution', 'aqi', 'smog'],
    'Transport': ['metro', 'bus', 'train', 'transport'],
    'Food': ['food', 'restaurant', 'festival', 'dining'],
    'Infrastructure': ['road', 'bridge', 'construction'],
    'Safety': ['police', 'security', 'crime'],
  };

  Object.entries(topicKeywords).forEach(([topic, keywords]) => {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      topics.push(topic);
    }
  });

  return topics.length > 0 ? topics : ['General'];
}

/**
 * Get mock social posts for a specific city
 * @param {string} city - City name
 * @returns {Array} Filtered posts for the city
 */
export function getMockPostsForCity(city) {
  return mockSocialPosts.filter(post => post.city === city);
}

/**
 * Get all mock social posts
 * @returns {Array} All mock posts
 */
export function getAllMockPosts() {
  return mockSocialPosts;
} 