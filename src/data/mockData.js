// Comprehensive Mock Data for CityPulse AI
// Realistic data for all major Indian cities

// Realistic city data with proper metrics
export const cityMetricsData = {
  'Delhi': {
    aqi: 320,
    temperature: 36,
    humidity: 48,
    weather: 'Hazy',
    traffic: 'Heavy',
    noise: 75,
    events: 12,
    tips: [
      'High AQI - Use masks and avoid outdoor activities',
      'Traffic congestion expected during peak hours',
      'Stay hydrated due to high temperature'
    ]
  },
  'Mumbai': {
    aqi: 80,
    temperature: 30,
    humidity: 70,
    weather: 'Rainy',
    traffic: 'Moderate',
    noise: 68,
    events: 8,
    tips: [
      'Heavy rainfall expected - carry rain protection',
      'Coastal flooding possible in low-lying areas',
      'Public transport recommended due to traffic'
    ]
  },
  'Bengaluru': {
    aqi: 120,
    temperature: 28,
    humidity: 60,
    weather: 'Partly Cloudy',
    traffic: 'Heavy',
    noise: 72,
    events: 15,
    tips: [
      'Traffic congestion common - use public transport',
      'Moderate AQI - sensitive groups should limit outdoor activity',
      'IT corridor experiencing heavy traffic'
    ]
  },
  'Chennai': {
    aqi: 95,
    temperature: 32,
    humidity: 65,
    weather: 'Sunny',
    traffic: 'Moderate',
    noise: 70,
    events: 6,
    tips: [
      'High humidity - stay hydrated',
      'Beach areas may have high foot traffic',
      'Evening showers expected'
    ]
  },
  'Kolkata': {
    aqi: 180,
    temperature: 34,
    humidity: 75,
    weather: 'Humid',
    traffic: 'Heavy',
    noise: 73,
    events: 10,
    tips: [
      'High humidity and moderate AQI',
      'Avoid outdoor activities during peak pollution hours',
      'Monsoon season approaching'
    ]
  },
  'Hyderabad': {
    aqi: 110,
    temperature: 31,
    humidity: 55,
    weather: 'Clear',
    traffic: 'Moderate',
    noise: 69,
    events: 9,
    tips: [
      'Good weather for outdoor activities',
      'IT corridor traffic manageable',
      'Evening breeze expected'
    ]
  },
  'Pune': {
    aqi: 85,
    temperature: 29,
    humidity: 58,
    weather: 'Pleasant',
    traffic: 'Light',
    noise: 65,
    events: 7,
    tips: [
      'Excellent weather conditions',
      'Low traffic congestion',
      'Good for outdoor activities'
    ]
  },
  'Ahmedabad': {
    aqi: 150,
    temperature: 35,
    humidity: 45,
    weather: 'Hot',
    traffic: 'Moderate',
    noise: 71,
    events: 5,
    tips: [
      'High temperature - stay indoors during peak hours',
      'Moderate AQI - limit outdoor activities',
      'Evening temperatures more comfortable'
    ]
  }
};

export const mockReports = [
  // Delhi Reports
  {
    id: '1',
    title: 'Severe Air Pollution in Connaught Place',
    description: 'AQI levels reaching hazardous levels due to vehicular emissions and construction dust',
    category: 'pollution',
    severity: 'High',
    city: 'Delhi',
    location: { lat: 28.6139, lng: 77.2090 },
    address: 'Connaught Place, New Delhi',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    userId: 'user1',
    aiTag: 'Pollution',
    status: 'active'
  },
  {
    id: '2',
    title: 'Traffic Gridlock on Ring Road',
    description: 'Major traffic jam on Outer Ring Road near AIIMS due to multiple accidents',
    category: 'traffic',
    severity: 'High',
    city: 'Delhi',
    location: { lat: 28.5676, lng: 77.2090 },
    address: 'Outer Ring Road, Delhi',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    userId: 'user2',
    aiTag: 'Traffic',
    status: 'active'
  },
  {
    id: '3',
    title: 'Power Outage in South Delhi',
    description: 'Widespread power failure affecting residential areas in Kalkaji and Greater Kailash',
    category: 'power',
    severity: 'High',
    city: 'Delhi',
    location: { lat: 28.5473, lng: 77.2519 },
    address: 'Kalkaji, South Delhi',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    userId: 'user3',
    aiTag: 'Power',
    status: 'active'
  },

  // Mumbai Reports
  {
    id: '4',
    title: 'Heavy Rainfall in Andheri',
    description: 'Torrential rain causing waterlogging and traffic disruption in Andheri East',
    category: 'weather',
    severity: 'Medium',
    city: 'Mumbai',
    location: { lat: 19.1197, lng: 72.8464 },
    address: 'Andheri East, Mumbai',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    userId: 'user4',
    aiTag: 'Weather',
    status: 'active'
  },
  {
    id: '5',
    title: 'Traffic Congestion on Western Express Highway',
    description: 'Slow-moving traffic due to ongoing metro construction work',
    category: 'traffic',
    severity: 'Medium',
    city: 'Mumbai',
    location: { lat: 19.0760, lng: 72.8777 },
    address: 'Western Express Highway, Mumbai',
    timestamp: new Date(Date.now() - 20 * 60 * 1000),
    userId: 'user5',
    aiTag: 'Traffic',
    status: 'active'
  },

  // Bengaluru Reports
  {
    id: '6',
    title: 'IT Corridor Traffic Jam',
    description: 'Heavy traffic on Outer Ring Road near Bellandur due to office rush hour',
    category: 'traffic',
    severity: 'High',
    city: 'Bengaluru',
    location: { lat: 12.9349, lng: 77.6050 },
    address: 'Bellandur, Bengaluru',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    userId: 'user6',
    aiTag: 'Traffic',
    status: 'active'
  },
  {
    id: '7',
    title: 'Waterlogging in Koramangala',
    description: 'Heavy rainfall causing water accumulation in residential areas',
    category: 'civic',
    severity: 'Medium',
    city: 'Bengaluru',
    location: { lat: 12.9349, lng: 77.6050 },
    address: 'Koramangala, Bengaluru',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    userId: 'user7',
    aiTag: 'Civic',
    status: 'active'
  },
  {
    id: '8',
    title: 'Power Outage in Indiranagar',
    description: 'Scheduled maintenance causing power cuts in commercial establishments',
    category: 'power',
    severity: 'Low',
    city: 'Bengaluru',
    location: { lat: 12.9789, lng: 77.5917 },
    address: 'Indiranagar, Bengaluru',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    userId: 'user8',
    aiTag: 'Power',
    status: 'active'
  },

  // Chennai Reports
  {
    id: '9',
    title: 'Beach Area Crowding',
    description: 'High foot traffic at Marina Beach causing traffic congestion',
    category: 'traffic',
    severity: 'Medium',
    city: 'Chennai',
    location: { lat: 13.0827, lng: 80.2707 },
    address: 'Marina Beach, Chennai',
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    userId: 'user9',
    aiTag: 'Traffic',
    status: 'active'
  },

  // Kolkata Reports
  {
    id: '10',
    title: 'Humidity and Heat Wave',
    description: 'Extreme humidity levels causing discomfort and health concerns',
    category: 'weather',
    severity: 'Medium',
    city: 'Kolkata',
    location: { lat: 22.5726, lng: 88.3639 },
    address: 'Central Kolkata',
    timestamp: new Date(Date.now() - 35 * 60 * 1000),
    userId: 'user10',
    aiTag: 'Weather',
    status: 'active'
  },

  // Hyderabad Reports
  {
    id: '11',
    title: 'IT Corridor Traffic',
    description: 'Moderate traffic on HITEC City route during office hours',
    category: 'traffic',
    severity: 'Low',
    city: 'Hyderabad',
    location: { lat: 17.3850, lng: 78.4867 },
    address: 'HITEC City, Hyderabad',
    timestamp: new Date(Date.now() - 40 * 60 * 1000),
    userId: 'user11',
    aiTag: 'Traffic',
    status: 'active'
  },

  // Pune Reports
  {
    id: '12',
    title: 'Pleasant Weather Conditions',
    description: 'Excellent weather with low pollution levels and clear skies',
    category: 'weather',
    severity: 'Low',
    city: 'Pune',
    location: { lat: 18.5204, lng: 73.8567 },
    address: 'Central Pune',
    timestamp: new Date(Date.now() - 50 * 60 * 1000),
    userId: 'user12',
    aiTag: 'Weather',
    status: 'active'
  },

  // Ahmedabad Reports
  {
    id: '13',
    title: 'High Temperature Alert',
    description: 'Extreme heat conditions affecting daily activities',
    category: 'weather',
    severity: 'High',
    city: 'Ahmedabad',
    location: { lat: 23.0225, lng: 72.5714 },
    address: 'Central Ahmedabad',
    timestamp: new Date(Date.now() - 55 * 60 * 1000),
    userId: 'user13',
    aiTag: 'Weather',
    status: 'active'
  },
  // Indore Reports
  {
    id: '21',
    title: 'Traffic Jam at Palasia Square',
    description: 'Heavy congestion due to ongoing roadwork and peak hour traffic.',
    category: 'traffic',
    severity: 'Medium',
    city: 'Indore',
    location: { lat: 22.7196, lng: 75.8577 },
    address: 'Palasia Square, Indore',
    timestamp: new Date(Date.now() - 50 * 60 * 1000),
    userId: 'user21',
    aiTag: 'Traffic',
    status: 'active'
  },
  {
    id: '22',
    title: 'Power Outage in Vijay Nagar',
    description: 'Unexpected power cut affecting residential blocks.',
    category: 'power',
    severity: 'High',
    city: 'Indore',
    location: { lat: 22.7519, lng: 75.8937 },
    address: 'Vijay Nagar, Indore',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    userId: 'user22',
    aiTag: 'Power',
    status: 'active'
  },
  {
    id: '23',
    title: 'Civic Issue at Rajwada',
    description: 'Overflowing garbage bins reported by local residents.',
    category: 'civic',
    severity: 'Medium',
    city: 'Indore',
    location: { lat: 22.7193, lng: 75.8579 },
    address: 'Rajwada, Indore',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    userId: 'user23',
    aiTag: 'Civic',
    status: 'active'
  },
  {
    id: '24',
    title: 'Rain Alert in Sudama Nagar',
    description: 'Heavy rainfall warning issued for the evening.',
    category: 'weather',
    severity: 'Low',
    city: 'Indore',
    location: { lat: 22.7197, lng: 75.8578 },
    address: 'Sudama Nagar, Indore',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    userId: 'user24',
    aiTag: 'Weather',
    status: 'active'
  },

  // Jaipur Reports
  {
    id: '25',
    title: 'Pollution Spike in Mansarovar',
    description: 'AQI levels rising due to increased vehicular emissions.',
    category: 'pollution',
    severity: 'High',
    city: 'Jaipur',
    location: { lat: 26.8851, lng: 75.7936 },
    address: 'Mansarovar, Jaipur',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    userId: 'user25',
    aiTag: 'Pollution',
    status: 'active'
  },
  {
    id: '26',
    title: 'Traffic Block at MI Road',
    description: 'Major traffic block due to festival procession.',
    category: 'traffic',
    severity: 'Medium',
    city: 'Jaipur',
    location: { lat: 26.9124, lng: 75.7873 },
    address: 'MI Road, Jaipur',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    userId: 'user26',
    aiTag: 'Traffic',
    status: 'active'
  },
  {
    id: '27',
    title: 'Power Fluctuation in C-Scheme',
    description: 'Frequent power fluctuations reported by businesses.',
    category: 'power',
    severity: 'Medium',
    city: 'Jaipur',
    location: { lat: 26.9126, lng: 75.7878 },
    address: 'C-Scheme, Jaipur',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    userId: 'user27',
    aiTag: 'Power',
    status: 'active'
  },
  {
    id: '28',
    title: 'Civic Issue at Bapu Bazaar',
    description: 'Waterlogging after recent rains causing inconvenience.',
    category: 'civic',
    severity: 'Low',
    city: 'Jaipur',
    location: { lat: 26.9157, lng: 75.8206 },
    address: 'Bapu Bazaar, Jaipur',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    userId: 'user28',
    aiTag: 'Civic',
    status: 'active'
  }
];

export const mockUsers = [
  {
    id: 'user1',
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    avatar: 'https://via.placeholder.com/40',
    preferences: {
      categories: ['traffic', 'pollution'],
      areas: ['Delhi', 'Mumbai'],
      notifications: true
    }
  },
  {
    id: 'user2',
    name: 'Priya Patel',
    email: 'priya@example.com',
    avatar: 'https://via.placeholder.com/40',
    preferences: {
      categories: ['weather', 'power'],
      areas: ['Bengaluru', 'Chennai'],
      notifications: true
    }
  }
];

export const mockPredictions = [
  {
    id: 'pred1',
    type: 'Traffic',
    area: 'Delhi',
    probability: 0.85,
    message: 'High probability of traffic congestion during evening rush hour',
    timeframe: '2-3 hours',
    timestamp: new Date()
  },
  {
    id: 'pred2',
    type: 'Weather',
    area: 'Mumbai',
    probability: 0.70,
    message: 'Heavy rainfall expected in coastal areas',
    timeframe: '4-6 hours',
    timestamp: new Date()
  },
  {
    id: 'pred3',
    type: 'Pollution',
    area: 'Delhi',
    probability: 0.90,
    message: 'AQI levels expected to remain hazardous',
    timeframe: '6-8 hours',
    timestamp: new Date()
  }
];

export const mockMoodMap = {
  'Delhi': {
    sentiment: 'Frustrated',
    intensity: 0.8,
    reports: 25
  },
  'Mumbai': {
    sentiment: 'Concerned',
    intensity: 0.6,
    reports: 18
  },
  'Bengaluru': {
    sentiment: 'Neutral',
    intensity: 0.5,
    reports: 22
  },
  'Chennai': {
    sentiment: 'Positive',
    intensity: 0.3,
    reports: 15
  },
  'Kolkata': {
    sentiment: 'Concerned',
    intensity: 0.7,
    reports: 20
  },
  'Hyderabad': {
    sentiment: 'Neutral',
    intensity: 0.4,
    reports: 12
  },
  'Pune': {
    sentiment: 'Positive',
    intensity: 0.2,
    reports: 8
  },
  'Ahmedabad': {
    sentiment: 'Frustrated',
    intensity: 0.6,
    reports: 14
  }
};

export const categories = [
  { id: 'traffic', name: 'Traffic', icon: '🚗', color: 'red' },
  { id: 'civic', name: 'Civic Issues', icon: '🏛️', color: 'blue' },
  { id: 'power', name: 'Power', icon: '⚡', color: 'yellow' },
  { id: 'weather', name: 'Weather', icon: '🌧️', color: 'gray' },
  { id: 'pollution', name: 'Pollution', icon: '🌫️', color: 'orange' }
];

export const areas = [
  'Delhi',
  'Mumbai', 
  'Bengaluru',
  'Chennai',
  'Kolkata',
  'Hyderabad',
  'Pune',
  'Ahmedabad'
];

// Map center coordinates (India center)
export const mapCenter = {
  lat: 23.5937,
  lng: 78.9629
}; 