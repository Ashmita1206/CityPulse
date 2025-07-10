import React, { useState, useEffect } from 'react';
import { getReports } from '../firebase/reportService';
import { generateMultiCityDigest } from '../agent/DigestGenerator';
import indianCities from '../data/indianCities';

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOnlyUnapproved, setShowOnlyUnapproved] = useState(false);
  const [sendingDigest, setSendingDigest] = useState(false);

  useEffect(() => {
    getReports().then((data) => {
      // Add mock approval status to reports
      const reportsWithStatus = data.map(report => ({
        ...report,
        approved: Math.random() > 0.3, // 70% approved for demo
        moderated: Math.random() > 0.5,
      }));
      setReports(reportsWithStatus);
      setLoading(false);
    });
  }, []);

  const handleModerate = (reportId, action) => {
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { ...report, approved: action === 'approve', moderated: true }
        : report
    ));
  };

  const handleDelete = (reportId) => {
    setReports(prev => prev.filter(report => report.id !== reportId));
  };

  const handleSendDigest = async () => {
    setSendingDigest(true);
    try {
      const cities = indianCities.slice(0, 5).map(c => c.name); // Top 5 cities
      const digests = await generateMultiCityDigest(reports, cities);
      
      // Mock email sending
      console.log('📧 Email Digest Generated:', digests);
      
      // Show success message
      alert(`Digest sent for ${cities.length} cities! Check console for details.`);
    } catch (error) {
      console.error('Digest sending failed:', error);
      alert('Failed to send digest. Please try again.');
    } finally {
      setSendingDigest(false);
    }
  };

  const filteredReports = showOnlyUnapproved 
    ? reports.filter(r => !r.approved)
    : reports;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-blue-800">🔐 Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={handleSendDigest}
              disabled={sendingDigest}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {sendingDigest ? 'Sending...' : '📧 Send Digest'}
            </button>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showOnlyUnapproved}
                onChange={(e) => setShowOnlyUnapproved(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">Only show unapproved</span>
            </label>
            <div className="text-sm text-gray-500">
              {filteredReports.length} of {reports.length} reports
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredReports.map((report) => (
            <div key={report.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-800">{report.description}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      report.approved 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {report.approved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 space-y-1">
                    <div>Location: {report.location}</div>
                    <div>AI Tag: {report.aiTag}</div>
                    <div>Submitted: {new Date(report.timestamp?.seconds * 1000 || report.timestamp).toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!report.approved && (
                    <button
                      onClick={() => handleModerate(report.id, 'approve')}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                      Approve
                    </button>
                  )}
                  {!report.moderated && (
                    <button
                      onClick={() => handleModerate(report.id, 'reject')}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Reject
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(report.id)}
                    className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            No reports found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 