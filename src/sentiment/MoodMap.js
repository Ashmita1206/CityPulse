import React from 'react';


const moodEmoji = {
  Happy: '😊',
  Frustrated: '😠',
  Concerned: '😟',
  Cautious: '😐',
  Neutral: '😐',
};
const sentimentColor = {
  Positive: 'bg-green-200 border-green-500',
  Negative: 'bg-red-200 border-red-500',
  Frustrated: 'bg-yellow-200 border-yellow-500',
  Concerned: 'bg-orange-200 border-orange-500',
  Cautious: 'bg-blue-200 border-blue-500',
  Neutral: 'bg-gray-200 border-gray-400',
};

// Fallback: If MapComponent is not suitable, render a grid
const MoodMap = ({ moodMapData = [] }) => {
  // Try to use MapComponent if available, else fallback
  // For demo, render a grid of regions with mood
  if (!moodMapData.length) return <div className="text-gray-400 text-center">No mood data available.</div>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-6">
      {moodMapData.map((region, idx) => (
        <div
          key={region.location + idx}
          className={`rounded-lg shadow p-4 flex items-center border-2 ${sentimentColor[region.sentiment] || 'bg-gray-100 border-gray-300'}`}
        >
          <span className="text-3xl mr-4">{moodEmoji[region.emotion] || '😐'}</span>
          <div className="flex-1">
            <div className="font-semibold text-blue-800">{region.location}</div>
            <div className="text-sm text-gray-700">{region.emotion} ({region.sentiment})</div>
            <div className="text-xs text-gray-500">Posts: {region.count}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MoodMap; 