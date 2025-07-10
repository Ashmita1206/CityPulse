import { geminiService } from '../services/geminiService';

/**
 * Conversational City Assistant
 * @param {string} question - User's question about a city
 * @param {Object} context - Optional context (reports, metrics, etc.)
 * @returns {Promise<string>} AI response
 */
export async function askCityAssistant(question, context = {}) {
  try {
    // Extract city name from question if present
    const cityMatch = question.match(/\b(Delhi|Mumbai|Bangalore|Chennai|Kolkata|Hyderabad|Pune|Ahmedabad|Jaipur|Lucknow)\b/i);
    const city = cityMatch ? cityMatch[1] : 'general';
    
    // Build context for AI
    const contextText = context.reports ? 
      `Recent reports: ${context.reports.map(r => r.description).join('. ')}` : '';
    const metricsText = context.metrics ? 
      `City metrics: AQI ${context.metrics.aqi}, Temp ${context.metrics.temperature}°C` : '';
    
    const fullPrompt = `Question: ${question}\nContext: ${contextText} ${metricsText}`;
    
    // Use Gemini to generate response
    const response = await geminiService.analyzeTextReport(fullPrompt, 'general');
    
    return response.summary || `I don't have enough information to answer that question about ${city}.`;
  } catch (error) {
    return "I'm sorry, I'm having trouble processing your question right now. Please try again.";
  }
}

// Helper function to detect question type
export function getQuestionType(question) {
  const lowerQ = question.toLowerCase();
  if (lowerQ.includes('trend') || lowerQ.includes('what\'s happening')) return 'trends';
  if (lowerQ.includes('air quality') || lowerQ.includes('aqi')) return 'air_quality';
  if (lowerQ.includes('traffic') || lowerQ.includes('congestion')) return 'traffic';
  if (lowerQ.includes('weather') || lowerQ.includes('temperature')) return 'weather';
  return 'general';
} 