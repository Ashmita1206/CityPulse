import React from 'react';

const ReportList = ({ reports = [] }) => {
  if (!reports.length) return <div className="text-gray-400 text-center">No reports yet.</div>;
  return (
    <div className="max-w-2xl mx-auto">
      <h3 className="text-md font-semibold mb-2 text-blue-700">Recent Reports</h3>
      <ul className="space-y-4">
        {reports.map(report => (
          <li key={report.id} className="bg-white rounded shadow p-4 flex items-center">
            {report.fileUrl && (
              <img src={report.fileUrl} alt="report media" className="w-16 h-16 object-cover rounded mr-4 border" />
            )}
            <div className="flex-1">
              <div className="font-medium text-gray-800">{report.description}</div>
              <div className="text-xs text-blue-600 mt-1">{report.aiTag}</div>
              <div className="text-xs text-gray-400 mt-1">{new Date(report.timestamp).toLocaleString()}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReportList; 