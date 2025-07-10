import React, { useState } from 'react';

const NotificationPanel = ({ notifications = [] }) => {
  const [dismissed, setDismissed] = useState([]);
  const unread = notifications.filter((_, idx) => !dismissed.includes(idx));

  if (!notifications.length) return null;

  return (
    <div className="fixed top-20 right-4 z-50 w-80 max-w-full">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border">
        <div className="flex items-center justify-between px-4 py-2 bg-blue-700 text-white">
          <span className="font-semibold">Notifications</span>
          {unread.length > 0 && <span className="ml-2 bg-red-500 text-xs px-2 py-1 rounded-full">{unread.length} unread</span>}
        </div>
        <ul className="divide-y divide-gray-200">
          {notifications.map((n, idx) =>
            dismissed.includes(idx) ? null : (
              <li key={idx} className="p-4 flex flex-col gap-1 bg-blue-50 hover:bg-blue-100 transition">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-blue-800">{n.title}</span>
                  <button
                    className="text-xs text-gray-400 hover:text-red-500 ml-2"
                    onClick={() => setDismissed(d => [...d, idx])}
                  >Dismiss</button>
                </div>
                <div className="text-sm text-gray-700">{n.message}</div>
                <div className="text-xs text-gray-400 mt-1">{new Date(n.timestamp).toLocaleString()}</div>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
};

export default NotificationPanel; 