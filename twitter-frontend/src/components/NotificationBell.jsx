import { useSocket } from '../context/SocketContext';
import { useEffect, useState } from 'react';

const NotificationBell = () => {
  const socket = useSocket();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!socket) return;

    const handler = (data) => {
      console.log("Received notification:", data);
      setNotifications((prev) => [data, ...prev]);
    };

    socket.on('notification', handler);

    return () => socket.off('notification', handler);
  }, [socket]);

  return (
    <div className="relative">
      🔔
      {notifications.length > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
          {notifications.length}
        </span>
      )}
    </div>
  );
};

export default NotificationBell;
