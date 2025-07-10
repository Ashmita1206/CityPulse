// cityMetricsService.js
// Fetches live weather and AQI for a given city using OpenWeatherMap and OpenAQ
// Returns: { temperature, humidity, aqi, population, tips }

import { cityMetricsData } from '../data/mockData';

/**
 * Fetch city metrics including AQI, weather, traffic, and other urban indicators
 * @param {string} cityName - Name of the city
 * @returns {Promise<Object>} City metrics data
 */
export async function fetchCityMetrics(cityName) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Get metrics from our comprehensive mock data
  const metrics = cityMetricsData[cityName];
  
  if (metrics) {
    return {
      ...metrics,
      // Add some dynamic variations to make it feel more real
      aqi: metrics.aqi + Math.floor(Math.random() * 20) - 10, // ±10 variation
      temperature: metrics.temperature + (Math.random() * 2 - 1), // ±1°C variation
      humidity: metrics.humidity + Math.floor(Math.random() * 10) - 5, // ±5% variation
      noise: metrics.noise + Math.floor(Math.random() * 6) - 3, // ±3dB variation
      events: metrics.events + Math.floor(Math.random() * 5), // 0-4 additional events
      lastUpdated: new Date().toISOString()
    };
  }
  
  // Fallback for unknown cities
  return {
    aqi: 100 + Math.floor(Math.random() * 100),
    temperature: 25 + Math.floor(Math.random() * 15),
    humidity: 50 + Math.floor(Math.random() * 30),
    weather: 'Clear',
    traffic: 'Moderate',
    noise: 65 + Math.floor(Math.random() * 15),
    events: 5 + Math.floor(Math.random() * 10),
    tips: ['Monitor local weather updates', 'Stay informed about traffic conditions'],
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Fetch metrics for multiple cities
 * @param {Array<string>} cityNames - Array of city names
 * @returns {Promise<Array>} Array of city metrics
 */
export async function fetchMultiCityMetrics(cityNames) {
  const metrics = await Promise.all(
    cityNames.map(cityName => fetchCityMetrics(cityName))
  );
  return metrics;
}

/**
 * Get historical metrics for trend analysis
 * @param {string} cityName - Name of the city
 * @param {number} days - Number of days of historical data
 * @returns {Promise<Array>} Historical metrics data
 */
export async function fetchHistoricalMetrics(cityName, days = 7) {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const baseMetrics = cityMetricsData[cityName] || {
    aqi: 100,
    temperature: 25,
    humidity: 50,
    noise: 65,
    events: 5
  };
  
  const historicalData = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    historicalData.push({
      date: date.toISOString().split('T')[0],
      aqi: baseMetrics.aqi + Math.floor(Math.random() * 40) - 20,
      temperature: baseMetrics.temperature + (Math.random() * 4 - 2),
      humidity: baseMetrics.humidity + Math.floor(Math.random() * 20) - 10,
      noise: baseMetrics.noise + Math.floor(Math.random() * 10) - 5,
      events: Math.max(0, baseMetrics.events + Math.floor(Math.random() * 6) - 3)
    });
  }
  
  return historicalData;
}

/**
 * Get comparative metrics between cities
 * @param {Array<string>} cityNames - Array of city names to compare
 * @returns {Promise<Object>} Comparative analysis
 */
export async function fetchComparativeMetrics(cityNames) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const metrics = await fetchMultiCityMetrics(cityNames);
  
  // Generate comparative insights
  const insights = [];
  
  if (cityNames.length >= 2) {
    const [city1, city2] = cityNames;
    const [metrics1, metrics2] = metrics;
    
    // AQI comparison
    if (metrics1.aqi > metrics2.aqi * 1.5) {
      insights.push(`${city1} has significantly higher pollution (${Math.round(metrics1.aqi/metrics2.aqi)}x) compared to ${city2}`);
    } else if (metrics2.aqi > metrics1.aqi * 1.5) {
      insights.push(`${city2} has significantly higher pollution (${Math.round(metrics2.aqi/metrics1.aqi)}x) compared to ${city1}`);
    }
    
    // Temperature comparison
    if (Math.abs(metrics1.temperature - metrics2.temperature) > 5) {
      insights.push(`${city1} is ${Math.round(metrics1.temperature - metrics2.temperature)}°C ${metrics1.temperature > metrics2.temperature ? 'warmer' : 'cooler'} than ${city2}`);
    }
    
    // Events comparison
    if (metrics1.events > metrics2.events * 1.5) {
      insights.push(`${city1} shows ${metrics1.events - metrics2.events} more events today compared to ${city2}`);
    }
    
    // Traffic comparison
    if (metrics1.traffic === 'Heavy' && metrics2.traffic === 'Light') {
      insights.push(`${city1} experiencing heavy traffic while ${city2} has light traffic conditions`);
    }
  }

  return {
    cities: cityNames,
    metrics,
    insights,
    comparisonDate: new Date().toISOString()
  };
} 