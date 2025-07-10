import React from 'react';

const severityColors = {
  High: 'bg-red-100 text-red-700 border-red-400',
  Medium: 'bg-yellow-100 text-yellow-700 border-yellow-400',
  Low: 'bg-green-100 text-green-700 border-green-400',
};

const SynthesizedEventsPanel = ({ synthesizedEvents = [] }) => {
  if (!synthesizedEvents.length) {
    return <div className="text-gray-400 text-center">No synthesized events detected.</div>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
      {synthesizedEvents.map((event, idx) => (
        <div key={idx} className="bg-white rounded-lg shadow p-4 border flex flex-col justify-between">
          <div className="flex items-center mb-2">
            <span className={`px-2 py-1 rounded text-xs font-semibold border ${severityColors[event.severity] || 'bg-gray-100 text-gray-700 border-gray-300'}`}>{event.severity}</span>
            <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{event.tag}</span>
            <span className="ml-auto text-xs text-gray-500">{event.count} reports</span>
          </div>
          <div className="font-semibold text-blue-800 mb-1">{event.area}</div>
          <div className="text-gray-700 text-sm mb-1">{event.summary}</div>
        </div>
      ))}
    </div>
  );
};

export default SynthesizedEventsPanel; 