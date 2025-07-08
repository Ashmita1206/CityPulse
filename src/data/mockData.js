// Mock data for CityPulse development

export const mockReports = [
  {
    id: '1',
    title: 'Heavy Traffic on MG Road',
    description: 'Major traffic jam due to accident near Central Mall',
    category: 'traffic',
    severity: 'High',
    location: { lat: 12.9716, lng: 77.5946 },
    address: 'MG Road, Bangalore',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    userId: 'user1',
    media: null,
    aiSummary: 'Heavy traffic congestion detected on main arterial road',
    prediction: 'Likely delay of 30-45 minutes',
    sentiment: 'Frustrated',
    status: 'active'
  },
  {
    id: '2',
    title: 'Waterlogging in Koramangala',
    description: 'Heavy rainfall causing water accumulation in residential area',
    category: 'civic',
    severity: 'Medium',
    location: { lat: 12.9349, lng: 77.6050 },
    address: 'Koramangala, Bangalore',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    userId: 'user2',
    media: 'waterlogging.jpg',
    aiSummary: 'Waterlogging reported in residential area',
    prediction: 'May affect morning commute',
    sentiment: 'Concerned',
    status: 'active'
  },
  {
    id: '3',
    title: 'Power Outage in Indiranagar',
    description: 'Complete power failure affecting commercial establishments',
    category: 'power',
    severity: 'High',
    location: { lat: 12.9789, lng: 77.5917 },
    address: 'Indiranagar, Bangalore',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    userId: 'user3',
    media: null,
    aiSummary: 'Power outage affecting commercial district',
    prediction: 'Restoration expected within 2 hours',
    sentiment: 'Inconvenienced',
    status: 'active'
  },
  {
    id: '4',
    title: 'Heavy Rainfall in Whitefield',
    description: 'Torrential rain causing visibility issues and minor flooding',
    category: 'weather',
    severity: 'Medium',
    location: { lat: 12.9692, lng: 77.7499 },
    address: 'Whitefield, Bangalore',
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    userId: 'user4',
    media: 'rainfall.jpg',
    aiSummary: 'Heavy rainfall causing visibility issues',
    prediction: 'Weather to improve by evening',
    sentiment: 'Cautious',
    status: 'active'
  }
];

export const mockUsers = [
  {
    id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://via.placeholder.com/40',
    preferences: {
      categories: ['traffic', 'civic'],
      areas: ['MG Road', 'Koramangala'],
      notifications: true
    }
  },
  {
    id: 'user2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://via.placeholder.com/40',
    preferences: {
      categories: ['weather', 'power'],
      areas: ['Indiranagar', 'Whitefield'],
      notifications: true
    }
  }
];

export const mockPredictions = [
  {
    id: 'pred1',
    type: 'Traffic',
    area: 'Downtown',
    probability: 0.75,
    message: 'High probability of traffic congestion during rush hour',
    timeframe: '2-3 hours',
    timestamp: new Date()
  },
  {
    id: 'pred2',
    type: 'Weather',
    area: 'North District',
    probability: 0.60,
    message: 'Possible heavy rainfall expected',
    timeframe: '4-6 hours',
    timestamp: new Date()
  },
  {
    id: 'pred3',
    type: 'Power',
    area: 'South District',
    probability: 0.45,
    message: 'Scheduled maintenance may cause brief outages',
    timeframe: '6-8 hours',
    timestamp: new Date()
  }
];

export const mockMoodMap = {
  downtown: {
    sentiment: 'Neutral',
    intensity: 0.5,
    reports: 15
  },
  northDistrict: {
    sentiment: 'Concerned',
    intensity: 0.7,
    reports: 8
  },
  southDistrict: {
    sentiment: 'Positive',
    intensity: 0.3,
    reports: 12
  },
  eastDistrict: {
    sentiment: 'Frustrated',
    intensity: 0.8,
    reports: 20
  }
};

export const categories = [
  { id: 'traffic', name: 'Traffic', icon: '🚗', color: 'red' },
  { id: 'civic', name: 'Civic Issues', icon: '🏛️', color: 'blue' },
  { id: 'power', name: 'Power', icon: '⚡', color: 'yellow' },
  { id: 'weather', name: 'Weather', icon: '🌧️', color: 'gray' }
];

export const areas = [
  'MG Road',
  'Koramangala',
  'Indiranagar',
  'Whitefield',
  'Downtown',
  'North District',
  'South District',
  'East District'
];

// Map center coordinates (Bangalore)
export const mapCenter = {
  lat: 12.9716,
  lng: 77.5946
}; 