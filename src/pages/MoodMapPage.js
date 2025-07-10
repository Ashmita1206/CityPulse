import React, { useEffect, useState } from 'react';
import MoodMap from '../sentiment/MoodMap';
import { analyzeSentimentByLocation } from '../sentiment/SentimentAnalyzer';

const mockPosts = [
  { text: 'The traffic in Delhi today is unbearable!', location: 'Delhi' },
  { text: 'Loved the weather in Bangalore ☀️', location: 'Bangalore' },
  { text: 'Pollution in Mumbai is so bad 😷', location: 'Mumbai' },
  { text: 'Great vibes at the Jaipur music fest!', location: 'Jaipur' },
];

const MoodMapPage = () => {
  const [moodMapData, setMoodMapData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMood() {
      setLoading(true);
      const data = await analyzeSentimentByLocation(mockPosts);
      setMoodMapData(data);
      setLoading(false);
    }
    fetchMood();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-800 mb-6 text-center">🌍 Sentiment Mood Map</h1>
        {loading ? (
          <div className="text-center text-gray-400">Analyzing mood data...</div>
        ) : (
          <MoodMap moodMapData={moodMapData} />
        )}
      </div>
    </div>
  );
};

export default MoodMapPage; 