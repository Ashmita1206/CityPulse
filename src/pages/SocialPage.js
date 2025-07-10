import React, { useState, useEffect } from 'react';
import SocialSentimentPanel from '../sentiment/SocialSentimentPanel';
import { analyzeSocialFeed, getAllMockPosts } from '../sentiment/SocialFeedAnalyzer';

const SocialPage = () => {
  const [analyzedPosts, setAnalyzedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSocialData = async () => {
      try {
        setLoading(true);
        const posts = getAllMockPosts();
        const analyzed = await analyzeSocialFeed(posts);
        setAnalyzedPosts(analyzed);
      } catch (error) {
        console.error('Failed to load social data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSocialData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading social media data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-800 mb-2">🌐 Social Media Sentiment</h1>
          <p className="text-gray-600">
            Real-time sentiment analysis from social media posts across Indian cities
          </p>
        </div>

        <SocialSentimentPanel analyzedPosts={analyzedPosts} />

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">📊 Sentiment Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl mb-2">😊</div>
              <div className="text-lg font-semibold text-green-700">Positive</div>
              <div className="text-sm text-gray-600">
                {analyzedPosts.filter(p => p.sentiment === 'Positive').length} posts
              </div>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-3xl mb-2">😐</div>
              <div className="text-lg font-semibold text-yellow-700">Neutral</div>
              <div className="text-sm text-gray-600">
                {analyzedPosts.filter(p => p.sentiment === 'Neutral').length} posts
              </div>
            </div>
            
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-3xl mb-2">😠</div>
              <div className="text-lg font-semibold text-red-700">Negative</div>
              <div className="text-sm text-gray-600">
                {analyzedPosts.filter(p => p.sentiment === 'Negative').length} posts
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialPage; 