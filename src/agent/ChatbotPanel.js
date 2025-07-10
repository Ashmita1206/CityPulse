import React, { useState } from 'react';
import { askCityAssistant } from './CityAssistant';

const ChatbotPanel = ({ context = {} }) => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    try {
      const aiResponse = await askCityAssistant(question, context);
      const newChat = {
        question,
        response: aiResponse,
        timestamp: new Date().toISOString(),
      };
      setChatHistory(prev => [...prev, newChat]);
      setResponse(aiResponse);
      setQuestion('');
    } catch (error) {
      setResponse("Sorry, I couldn't process your question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
          <span className="text-white font-bold">AI</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">City Assistant</h3>
          <p className="text-sm text-gray-500">Ask me about cities, trends, and insights</p>
        </div>
      </div>

      {/* Chat History */}
      <div className="max-h-64 overflow-y-auto mb-4 space-y-3">
        {chatHistory.map((chat, idx) => (
          <div key={idx} className="space-y-2">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm font-medium text-blue-800">You:</div>
              <div className="text-sm text-gray-700">{chat.question}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm font-medium text-gray-800">Assistant:</div>
              <div className="text-sm text-gray-700">{chat.response}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Question Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about cities, trends, air quality..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Thinking...' : 'Ask'}
        </button>
      </form>

      {/* Example Questions */}
      <div className="mt-4">
        <p className="text-xs text-gray-500 mb-2">Try asking:</p>
        <div className="flex flex-wrap gap-2">
          {[
            "What's trending in Mumbai?",
            "How is Delhi's air quality?",
            "Traffic situation in Bangalore"
          ].map((example, idx) => (
            <button
              key={idx}
              onClick={() => setQuestion(example)}
              className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatbotPanel; 