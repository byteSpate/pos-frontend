import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useSocket from '../../hooks/useSocket';
import SocketConnectionStatus from './SocketConnectionStatus';

const NotificationProvider = ({ children }) => {
  const { socket, isConnected, userRole } = useSocket();

  useEffect(() => {
    if (isConnected) {
      console.log(`Notifications enabled for ${userRole}`);
      
      // Test notification reception
      if (socket && socket.socket) {
        socket.socket.on('test', (data) => {
          console.log('Test notification received:', data);
        });
      }
    } else {
      console.log('Socket not connected, notifications disabled');
    }
  }, [isConnected, userRole, socket]);

  return (
    <>
      {children}
      <SocketConnectionStatus />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
        style={{ zIndex: 9999 }}
        limit={3}
      />
    </>
  );
};

export default NotificationProvider;
