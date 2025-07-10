import React from 'react';

const sentimentEmoji = {
  Positive: '😊',
  Negative: '😠',
  Neutral: '😐',
  Frustrated: '😤',
  Concerned: '😟',
  Cautious: '🤔',
};

const topicColors = {
  'Traffic': 'bg-red-100 text-red-700',
  'Weather': 'bg-blue-100 text-blue-700',
  'Power': 'bg-yellow-100 text-yellow-700',
  'Air Quality': 'bg-orange-100 text-orange-700',
  'Transport': 'bg-green-100 text-green-700',
  'Food': 'bg-purple-100 text-purple-700',
  'Infrastructure': 'bg-gray-100 text-gray-700',
  'Safety': 'bg-indigo-100 text-indigo-700',
  'General': 'bg-gray-100 text-gray-600',
};

const SocialSentimentPanel = ({ analyzedPosts = [] }) => {
  // Group posts by city
  const cityGroups = analyzedPosts.reduce((groups, post) => {
    if (!groups[post.city]) {
      groups[post.city] = [];
    }
    groups[post.city].push(post);
    return groups;
  }, {});

  // Calculate city sentiment
  const citySentiments = Object.entries(cityGroups).map(([city, posts]) => {
    const sentimentCounts = posts.reduce((counts, post) => {
      counts[post.sentiment] = (counts[post.sentiment] || 0) + 1;
      return counts;
    }, {});

    const dominantSentiment = Object.entries(sentimentCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Neutral';

    const allTopics = posts.flatMap(post => post.topics);
    const topicCounts = allTopics.reduce((counts, topic) => {
      counts[topic] = (counts[topic] || 0) + 1;
      return counts;
    }, {});

    return {
      city,
      posts: posts.length,
      dominantSentiment,
      topics: topicCounts,
    };
  });

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-blue-800 mb-4">🌐 Social Media Sentiment</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {citySentiments.map((cityData) => (
          <div key={cityData.city} className="border rounded-lg p-4 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">{cityData.city}</h3>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{sentimentEmoji[cityData.dominantSentiment]}</span>
                <span className="text-sm text-gray-500">{cityData.posts} posts</span>
              </div>
            </div>
            
            <div className="mb-3">
              <span className="text-sm font-medium text-gray-600">Dominant Mood:</span>
              <span className="ml-2 text-sm font-semibold text-blue-600">
                {cityData.dominantSentiment}
              </span>
            </div>

            <div>
              <span className="text-sm font-medium text-gray-600">Top Topics:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {Object.entries(cityData.topics)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 3)
                  .map(([topic, count]) => (
                    <span
                      key={topic}
                      className={`px-2 py-1 rounded text-xs font-medium ${topicColors[topic] || topicColors.General}`}
                    >
                      {topic} ({count})
                    </span>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {citySentiments.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No social media data available.
        </div>
      )}
    </div>
  );
};

export default SocialSentimentPanel; 