// cityMetricsService.js
// Fetches live weather and AQI for a given city using OpenWeatherMap and OpenAQ
// Returns: { temperature, humidity, aqi, population, tips }

import indianCities from '../data/indianCities';

// Use the provided OpenWeatherMap API key directly
const OPENWEATHERMAP_API_KEY = 'ae1a283ddd4a9dda00929c1634b6bde4';
const OPENWEATHERMAP_URL = 'https://api.openweathermap.org/data/2.5/weather';

// GeoDB Cities API (RapidAPI endpoint)
console.log('[CityPulse] Using RapidAPI Key:', process.env.REACT_APP_RAPIDAPI_KEY);

const fetchPopulationByCoords = async (lat, lon) => {
  const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?latitude=${lat}&longitude=${lon}&radius=50&limit=1`;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
    },
  };
  try {
    const response = await fetch(url, options);
    if (response.status === 429) {
      console.error('[CityPulse] Population API rate limit hit (429)');
      return 'Data not available';
    }
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const result = await response.json();
    const population = result.data?.[0]?.population || 'Data not available';
    return population;
  } catch (error) {
    console.error('[CityPulse] Population API error:', error);
    return 'Data not available';
  }
};

// Remove population logic, fetchPopulationByCoords, and all references to population in fetchCityMetrics and logs.

const cityTips = {
  'Mumbai': 'Coastal flooding is a concern during monsoons. Stay updated on weather alerts.',
  'Delhi': 'High AQI in winter. Use masks and avoid outdoor activity on smoggy days.',
  'Bengaluru': 'Traffic congestion is common. Use public transport when possible.',
  'Kolkata': 'Prepare for heavy rains during monsoon. Watch for waterlogging.',
  'Chennai': 'Cyclones can affect the city. Follow official advisories during storms.',
  'Hyderabad': 'Summer heat can be intense. Stay hydrated and avoid peak sun hours.',
  'Pune': 'Air quality is generally good, but check AQI during winter.',
  'Ahmedabad': 'Extreme heat in summer. Use sun protection and stay indoors at noon.',
  'Jaipur': 'Desert climate means hot days and cool nights. Dress accordingly.',
  'Lucknow': 'Fog can disrupt travel in winter. Plan accordingly.'
};

// 1️⃣ Add your AQICN API token here
const WAQI_API_KEY = process.env.REACT_APP_WAQI_API_KEY || "f23ee289fb9a24ca70dd6b409eae03cd50781aa2";

// 2️⃣ Function to fetch AQI from AQICN
export async function fetchAQI(lat, lon) {
  try {
    const url = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${WAQI_API_KEY}`;
    console.log("[CityPulse] AQICN URL:", url);
    const response = await fetch(url);
    const data = await response.json();
    if (data.status === "ok" && data.data && data.data.aqi !== undefined) {
      console.log("[CityPulse] AQICN AQI Value:", data.data.aqi);
      return data.data.aqi;
    } else {
      console.warn("[CityPulse] AQICN returned no valid data:", data);
      return null;
    }
  } catch (error) {
    console.error("[CityPulse] AQICN API error:", error);
    return null;
  }
}

export async function fetchCityMetrics(cityName) {
  const city = indianCities.find(c => c.name === cityName);
  if (!city) {
    console.warn(`[CityPulse] City not found in indianCities.js:`, cityName);
    throw new Error('City not found');
  }
  if (typeof city.lat === 'undefined' || typeof city.lon === 'undefined') {
    console.warn(`[CityPulse] Coordinates missing for city:`, cityName, city);
  }
  if (!OPENWEATHERMAP_API_KEY) {
    console.warn('[CityPulse] OpenWeatherMap API key is missing.');
  }
  console.log(`[CityPulse] Fetching weather for city: ${cityName} with lat/lon: ${city.lat}, ${city.lon}`);

  // 1. Fetch weather from OpenWeatherMap
  let temperature = 'Data not available', humidity = 'Data not available', weatherApiError = null;
  const weatherUrl = `${OPENWEATHERMAP_URL}?lat=${city.lat}&lon=${city.lon}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`;
  console.log('[CityPulse] OpenWeatherMap URL:', weatherUrl);
  try {
    const weatherRes = await fetch(weatherUrl);
    if (weatherRes.ok) {
      const weatherData = await weatherRes.json();
      console.log('[CityPulse] OpenWeatherMap data:', weatherData);
      if (typeof weatherData.main?.temp === 'number') {
        temperature = weatherData.main.temp;
      } else {
        console.warn('[CityPulse] temperature is not available or not a number:', weatherData.main?.temp);
      }
      if (typeof weatherData.main?.humidity === 'number') {
        humidity = weatherData.main.humidity;
      } else {
        console.warn('[CityPulse] humidity is not available or not a number:', weatherData.main?.humidity);
      }
    } else {
      weatherApiError = `OpenWeatherMap error: ${weatherRes.status}`;
      const errorData = await weatherRes.json().catch(() => ({}));
      console.warn(weatherApiError, errorData);
    }
  } catch (e) {
    weatherApiError = e.message;
    console.error('OpenWeatherMap fetch error:', e);
  }

  // 2. Fetch AQI from AQICN
  let aqi = 'Data not available';
  try {
    const aqiValue = await fetchAQI(city.lat, city.lon);
    if (typeof aqiValue === 'number') {
      aqi = aqiValue;
    }
  } catch (e) {
    console.error('[CityPulse] AQICN fetch error:', e);
    aqi = 'Data not available';
  }

  // 3. Fetch population
  let population = 'Data not available';
  try {
    population = await fetchPopulationByCoords(city.lat, city.lon);
  } catch (e) {
    console.error('[CityPulse] Population fetch error:', e);
    population = 'Data not available';
  }

  // 4. Tips: Only the relevant tip for the city, always as array
  let tips = cityTips[cityName] ? [cityTips[cityName]] : [];

  // 5. Log extracted values
  console.log('[CityPulse] Extracted metrics:', { temperature, humidity, aqi, population });
  if (temperature === 'Data not available') console.warn('[CityPulse] Fallback: temperature is unavailable');
  if (humidity === 'Data not available') console.warn('[CityPulse] Fallback: humidity is unavailable');
  if (aqi === 'Data not available') console.warn('[CityPulse] Fallback: AQI is unavailable');
  if (population === 'Data not available') console.warn('[CityPulse] Fallback: Population is unavailable');

  // 6. Final log before return
  console.log('[CityPulse] Final city metrics:', {
    temperature,
    humidity,
    aqi,
    population,
  });

  return {
    temperature: typeof temperature === 'number' ? temperature : 'Data not available',
    humidity: typeof humidity === 'number' ? humidity : 'Data not available',
    aqi: typeof aqi === 'number' ? aqi : 'Data not available',
    population: typeof population === 'number' ? population : 'Data not available',
    tips
  };
} 