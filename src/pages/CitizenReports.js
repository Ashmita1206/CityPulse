import React, { useState } from 'react';
import { ReportUploadForm, ReportList } from '../reports';

const CitizenReports = () => {
  const [reports, setReports] = useState([]);

  const handleReportSubmit = (report) => {
    setReports(prev => [report, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-800 mb-6 text-center">Citizen Reports</h1>
        <ReportUploadForm onReportSubmit={handleReportSubmit} />
        <ReportList reports={reports} />
      </div>
    </div>
  );
};

export default CitizenReports; 