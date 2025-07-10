// src/components/NotificationBell.jsx

import { useSocket } from '../context/SocketContext';
import { useEffect, useState } from 'react';

const NotificationBell = () => {
  const socket = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!socket) return;

    const handler = (data) => {
      console.log("🔔 Notification received:", data);
      setNotifications((prev) => [data, ...prev]);
    };

    socket.on('notification', handler);

    return () => {
      socket.off('notification', handler);
    };
  }, [socket]);

  const toggleDropdown = () => {
    setOpen(!open);
  };

  return (
    <div className="relative inline-block">
      <button onClick={toggleDropdown} className="relative text-xl">
        🔔
        {notifications.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">
            {notifications.length}
          </span>
        )}
      </button>
      {open && notifications.length > 0 && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded shadow-lg z-50">
          <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
            {notifications.map((n, index) => (
              <li key={index} className="p-2 text-sm hover:bg-gray-100">
                {n.type === "like" && (
                  <span>User {n.from} liked your tweet #{n.tweetId}</span>
                )}
                {n.type === "follow" && (
                  <span>User {n.from} started following you.</span>
                )}
                {n.type === "reply" && (
                  <span>User {n.from} replied to your tweet #{n.tweetId}</span>
                )}
                {/* Add other notification types as needed */}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
