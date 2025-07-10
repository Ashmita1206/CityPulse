import indianCities from '../data/indianCities';

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in kilometers
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Detect user location and find nearest city
 * @returns {Promise<Object>} Nearest city object or null
 */
export async function detectUserLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.log('Geolocation not supported');
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;

        // Find nearest city
        let nearestCity = null;
        let minDistance = Infinity;

        indianCities.forEach(city => {
          const distance = calculateDistance(
            userLat, 
            userLon, 
            city.lat, 
            city.lon
          );
          
          if (distance < minDistance) {
            minDistance = distance;
            nearestCity = { ...city, distance };
          }
        });

        console.log(`📍 Detected location: ${nearestCity?.name} (${minDistance.toFixed(1)}km away)`);
        resolve(nearestCity);
      },
      (error) => {
        console.log('Location detection failed:', error.message);
        resolve(null);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
}

/**
 * Get user's approximate location without geolocation
 * @returns {Object} Default city (Delhi)
 */
export function getDefaultLocation() {
  return indianCities.find(city => city.name === 'Delhi') || indianCities[0];
} 