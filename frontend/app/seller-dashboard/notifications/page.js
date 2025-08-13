'use client';
  import { useEffect, useState } from 'react';

export default function AnnouncementsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Dummy notifications
    setNotifications([
      {
        id: 1,
        title: '🎉 New Feature: Model Analytics!',
        message: 'You can now see real-time views and downloads for each model in your dashboard.',
        date: '2025-06-11',
        type: 'info',
      },
      {
        id: 2,
        title: '⚠️ Scheduled Maintenance',
        message: 'The site will be under maintenance on June 15 from 12 AM to 2 AM IST.',
        date: '2025-06-10',
        type: 'warning',
      },
      {
        id: 3,
        title: '✅ KYC Verified!',
        message: 'Congratulations! Your KYC has been successfully verified.',
        date: '2025-06-08',
        type: 'success',
      },
      {
        id: 4,
        title: '🚀 Your Model Just Got Purchased!',
        message: '"Cartoon House" was just purchased by a buyer. Check your earnings tab.',
        date: '2025-06-07',
        type: 'success',
      },
    ]);
  }, []);

  const getColorByType = (type) => {
    switch (type) {
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📢 Announcements & Notifications</h1>

      {notifications.length === 0 ? (
        <p className="text-gray-600">No announcements or notifications right now.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((note) => (
            <div
              key={note.id}
              className={`p-4 rounded-xl shadow-sm border ${getColorByType(note.type)}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">{note.title}</h2>
                  <p className="text-sm mt-1">{note.message}</p>
                </div>
                <span className="text-xs text-gray-500">{note.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
