import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import socketService from '../services/socketService';

const useSocket = () => {
  const { _id, role, isAuth } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuth && _id && role) {
      console.log('Connecting and authenticating socket...');
      socketService.setDispatch(dispatch);
      socketService.connectAndAuthenticate(_id, role);
    } else {
      console.log('Disconnecting socket...');
      socketService.disconnect();
    }

    return () => {
      socketService.disconnect();
    };
  }, [isAuth, _id, role, dispatch]);

  return {
    socket: socketService,
    isConnected: socketService.getConnectionStatus().isConnected,
    userRole: socketService.getConnectionStatus().userRole,
  };
};

export default useSocket;
