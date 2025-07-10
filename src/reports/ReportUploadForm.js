import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import indianCities from '../data/indianCities';
import { addReport } from '../firebase/reportService';

const ReportUploadForm = ({ onReportSubmitted }) => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [city, setCity] = useState(indianCities[0]?.name || '');
  const [location, setLocation] = useState('');

  const [aiResult, setAiResult] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Try to auto-detect location
  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation(`${pos.coords.latitude},${pos.coords.longitude}`);
        },
        () => {
          setLocation('');
        }
      );
    }
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setAiResult(null);
  };

  const resetForm = () => {
    setFile(null);
    setDescription('');
    setCity(indianCities[0]?.name || '');
    setLocation('');
    setAiResult(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      if (!file || !description) {
        setError('Please provide a photo/video and description.');
        setSubmitting(false);
        return;
      }
      // AI analysis (mock or real)
      const ai = await geminiService.analyzeMedia(file, description);
      setAiResult(ai);
      await addReport({
        file,
        description,
        location: location || city,
        aiTag: ai.summary,
      });
      if (onReportSubmitted) onReportSubmitted();
      resetForm();
    } catch (err) {
      setError('Error uploading report.');
      console.error('Error uploading report:', err);
    }
    setSubmitting(false);
  };

  return (
    <form className="bg-white rounded-lg shadow p-6 mb-6 max-w-xl mx-auto" onSubmit={handleSubmit}>
      <h2 className="text-lg font-semibold mb-4 text-blue-700">Report an Issue</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Photo/Video</label>
        <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="block w-full" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Description</label>
        <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Describe the issue..." />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Location</label>
        {location ? (
          <div className="text-xs text-gray-500 mb-1">Auto: {location}</div>
        ) : null}
        <select value={city} onChange={e => setCity(e.target.value)} className="w-full border rounded px-3 py-2">
          {indianCities.map(c => (
            <option key={c.name} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit Report'}
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {aiResult && (
        <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-100">
          <div className="font-medium text-blue-700">AI Categorization:</div>
          <div className="text-sm text-gray-700">{aiResult.summary}</div>
          <div className="text-xs text-gray-500">Detected: {aiResult.detectedObjects?.join(', ')}</div>
        </div>
      )}
    </form>
  );
};

export default ReportUploadForm; 