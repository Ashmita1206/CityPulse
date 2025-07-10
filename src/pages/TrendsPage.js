import React, { useMemo, useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { getReports } from '../firebase/reportService';
import { analyzeSentimentByLocation } from '../sentiment/SentimentAnalyzer';
import { usePDF } from 'react-to-pdf';

// Mock reports data
const mockReports = [
  { category: 'Traffic', location: 'Delhi', timestamp: '2024-06-01T10:00:00Z', aiTag: 'Traffic', description: 'Heavy traffic in Delhi' },
  { category: 'Traffic', location: 'Delhi', timestamp: '2024-06-01T12:00:00Z', aiTag: 'Traffic', description: 'Congestion on Ring Road' },
  { category: 'Power', location: 'Mumbai', timestamp: '2024-06-01T11:00:00Z', aiTag: 'Power', description: 'Power outage in Mumbai' },
  { category: 'Pollution', location: 'Delhi', timestamp: '2024-06-02T09:00:00Z', aiTag: 'Pollution', description: 'High AQI in Delhi' },
  { category: 'Traffic', location: 'Bangalore', timestamp: '2024-06-02T10:00:00Z', aiTag: 'Traffic', description: 'Traffic jam in Bangalore' },
  { category: 'Power', location: 'Mumbai', timestamp: '2024-06-02T13:00:00Z', aiTag: 'Power', description: 'Transformer issue in Mumbai' },
  { category: 'Pollution', location: 'Delhi', timestamp: '2024-06-03T08:00:00Z', aiTag: 'Pollution', description: 'Smog in Delhi' },
  { category: 'Traffic', location: 'Delhi', timestamp: '2024-06-03T10:00:00Z', aiTag: 'Traffic', description: 'Slow traffic in Delhi' },
  { category: 'Traffic', location: 'Bangalore', timestamp: '2024-06-03T11:00:00Z', aiTag: 'Traffic', description: 'Bumper to bumper in Bangalore' },
  { category: 'Power', location: 'Delhi', timestamp: '2024-06-03T12:00:00Z', aiTag: 'Power', description: 'Delhi power cut' },
];

const dateRanges = [
  { label: 'Last 7 days', value: 7 },
  { label: 'Last 30 days', value: 30 },
  { label: 'All', value: null },
];

function parseDate(ts) {
  if (!ts) return '';
  if (typeof ts === 'object' && ts.seconds) {
    // Firestore Timestamp
    return new Date(ts.seconds * 1000).toISOString().slice(0, 10);
  }
  return new Date(ts).toISOString().slice(0, 10);
}

function getLineChartData(reports) {
  const byDateCat = {};
  reports.forEach(r => {
    const date = parseDate(r.timestamp);
    const tag = r.aiTag || r.category || 'Other';
    if (!byDateCat[date]) byDateCat[date] = {};
    byDateCat[date][tag] = (byDateCat[date][tag] || 0) + 1;
  });
  return Object.entries(byDateCat).map(([date, cats]) => ({ date, ...cats }));
}

function getBarChartData(reports) {
  const locCounts = {};
  reports.forEach(r => {
    const loc = r.location?.city || r.location?.area || r.location || 'Unknown';
    locCounts[loc] = (locCounts[loc] || 0) + 1;
  });
  return Object.entries(locCounts)
    .map(([location, count]) => ({ location, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

function getSentimentChartData(moodMapData) {
  // [{ location, sentiment, count }]
  const locations = Array.from(new Set(moodMapData.map(m => m.location)));
  const sentiments = Array.from(new Set(moodMapData.map(m => m.sentiment)));
  return locations.map(loc => {
    const entry = { location: loc };
    sentiments.forEach(sent => {
      entry[sent] = moodMapData.find(m => m.location === loc && m.sentiment === sent)?.count || 0;
    });
    return entry;
  });
}

const TrendsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [useMock, setUseMock] = useState(false);
  const [showSentiment, setShowSentiment] = useState(false);
  const [sentimentData, setSentimentData] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const { toPDF, targetRef } = usePDF({ filename: 'citypulse-trends-report.pdf' });

  useEffect(() => {
    if (useMock) return;
    setLoading(true);
    getReports().then((data) => {
      setReports(data);
      setLoading(false);
    });
  }, [useMock]);

  // Filtering
  const chartReports = useMemo(() => {
    let data = useMock ? mockReports : reports;
    if (selectedTag) data = data.filter(r => (r.aiTag || r.category) === selectedTag);
    if (dateRange) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - dateRange);
      data = data.filter(r => {
        const d = new Date(parseDate(r.timestamp));
        return d >= cutoff;
      });
    }
    return data;
  }, [useMock, reports, selectedTag, dateRange]);

  const lineData = useMemo(() => getLineChartData(chartReports), [chartReports]);
  const barData = useMemo(() => getBarChartData(chartReports), [chartReports]);

  // Sentiment overlay
  useEffect(() => {
    if (!showSentiment) return;
    const posts = chartReports.map(r => ({
      text: r.description || r.summary || r.aiTag || r.category,
      location: r.location?.city || r.location?.area || r.location || 'Unknown',
    }));
    analyzeSentimentByLocation(posts).then(setSentimentData);
  }, [showSentiment, chartReports]);

  const sentimentChartData = useMemo(() => getSentimentChartData(sentimentData), [sentimentData]);
  const sentimentKeys = useMemo(() => Object.keys(sentimentChartData[0] || {}).filter(k => k !== 'location'), [sentimentChartData]);

  // Unique tags for filter
  const uniqueTags = useMemo(() => {
    const data = useMock ? mockReports : reports;
    return Array.from(new Set(data.map(r => r.aiTag || r.category))).filter(Boolean);
  }, [useMock, reports]);



  return (
    <div ref={targetRef} className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-blue-800">📈 CityPulse Trend Analytics</h1>
          <button
            onClick={toPDF}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            📄 Download Summary
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <label className="text-sm font-semibold">Data Source:</label>
          <button
            className={`px-3 py-1 rounded ${useMock ? 'bg-blue-100 text-blue-700' : 'bg-white border'} transition`}
            onClick={() => setUseMock(false)}
          >Live Data</button>
          <button
            className={`px-3 py-1 rounded ${useMock ? 'bg-white border' : 'bg-blue-100 text-blue-700'} transition`}
            onClick={() => setUseMock(true)}
          >Mock Data</button>
          <label className="ml-6 text-sm font-semibold">AI Tag:</label>
          <select
            value={selectedTag}
            onChange={e => setSelectedTag(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          >
            <option value="">All</option>
            {uniqueTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
          <label className="ml-6 text-sm font-semibold">Date Range:</label>
          <select
            value={dateRange || ''}
            onChange={e => setDateRange(e.target.value ? Number(e.target.value) : null)}
            className="border border-gray-300 rounded px-2 py-1"
          >
            {dateRanges.map(opt => (
              <option key={opt.value || 'all'} value={opt.value || ''}>{opt.label}</option>
            ))}
          </select>
          <label className="ml-6 text-sm font-semibold">Sentiment Overlay:</label>
          <input
            type="checkbox"
            checked={showSentiment}
            onChange={e => setShowSentiment(e.target.checked)}
            className="ml-2"
          />
          {loading && <span className="ml-4 text-blue-500 animate-pulse">Loading...</span>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Reports per Day by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                {Object.keys(lineData[0] || {}).filter(k => k !== 'date').map((cat, idx) => (
                  <Line key={cat} type="monotone" dataKey={cat} stroke={["#2563eb","#f59e42","#ef4444","#10b981","#a21caf"][idx%5]} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Top 5 Locations by Incident Count</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="location" type="category" />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {showSentiment && (
          <div className="bg-white rounded-lg shadow p-4 mt-8">
            <h2 className="text-lg font-semibold mb-4">Sentiment Breakdown by Location</h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={sentimentChartData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="location" type="category" />
                <Tooltip />
                <Legend />
                {sentimentKeys.map((sent, idx) => (
                  <Bar key={sent} dataKey={sent} stackId="a" fill={["#10b981","#f59e42","#ef4444","#2563eb","#a21caf"][idx%5]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendsPage; 