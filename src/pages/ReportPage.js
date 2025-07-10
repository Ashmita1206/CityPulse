import React, { useState, useEffect } from 'react';
import { ReportUploadForm, ReportList } from '../reports';
import { onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import MapComponent from '../components/MapComponent';

const ReportPage = () => {
  const [reports, setReports] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'reports'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedReports = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReports(fetchedReports);
    });
    return () => unsubscribe();
  }, []);

  const handleReportSubmitted = () => {
    // No-op: real-time updates handled by onSnapshot
  };

  // Filter reports with valid lat/lng location
  const reportsWithLocation = reports.filter(
    (report) => report.location && report.location.lat && report.location.lng
  );

  // Filter by selected AI tag
  const filteredReports = selectedTag
    ? reportsWithLocation.filter((r) => r.aiTag === selectedTag)
    : reportsWithLocation;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-800 mb-6 text-center">📸 Citizen Reporting Portal</h1>
        <ReportUploadForm onReportSubmitted={handleReportSubmitted} />
        <ReportList reports={reports} />
      </div>
      <div className="my-6 max-w-4xl mx-auto">
        <div className="flex gap-4 my-4 items-center">
          <label className="text-sm font-semibold">Filter by AI Tag:</label>
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          >
            <option value="">All</option>
            {[...new Set(reports.map((r) => r.aiTag))].map((tag) => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
        <h2 className="text-xl font-semibold mb-2">🗺️ Report Map View</h2>
        <MapComponent
          markers={filteredReports.map((report) => ({
            lat: report.location.lat,
            lng: report.location.lng,
            title: report.description,
            id: report.id,
          }))}
        />
      </div>
    </div>
  );
};

export default ReportPage; 