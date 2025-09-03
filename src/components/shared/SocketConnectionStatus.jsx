import React from 'react';
import useSocket from '../../hooks/useSocket';

const SocketConnectionStatus = () => {
  const { isConnected, userRole } = useSocket();

  if (!isConnected) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-500 text-white px-3 py-2 rounded-lg shadow-lg text-sm">
        🔴 Disconnected from notifications
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-green-500 text-white px-3 py-2 rounded-lg shadow-lg text-sm">
      🟢 Connected as {userRole}
    </div>
  );
};

export default SocketConnectionStatus;
