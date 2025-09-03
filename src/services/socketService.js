import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import { addNotification } from '../redux/slices/notificationSlice';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.userRole = null;
    this.userId = null;
    this.dispatch = null; // Will be set from the hook
    this.listenersSetup = false; // Track if listeners are already setup
  }

  connectAndAuthenticate(userId, role, serverUrl = 'http://localhost:8000') {
    this.userId = userId;
    this.userRole = role;
    this.connect(serverUrl);
  }

  // Initialize socket connection
  connect(serverUrl = 'http://localhost:8000') {
    if (this.socket && this.socket.connected) {
      console.log('Socket already connected, reusing existing connection');
      return this.socket;
    }

    // Disconnect existing socket if any
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.listenersSetup = false;
    }

    console.log('Creating new socket connection to:', serverUrl);
    this.socket = io(serverUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      forceNew: true // Force new connection to prevent duplicates
    });

    this.setupEventListeners();
    return this.socket;
  }

  // Set dispatch function for Redux integration
  setDispatch(dispatch) {
    this.dispatch = dispatch;
  }

  // Authenticate user with role
  authenticate(userId, role) {
    if (!this.socket) {
      console.error('Socket not connected');
      return;
    }

    this.userId = userId;
    this.userRole = role;
    
    console.log('Authenticating user:', { userId, role });
    this.socket.emit('authenticate', { userId, role });
    this.socket.emit('joinRole', role);
  }

  // Setup event listeners
  setupEventListeners() {
    if (!this.socket) return;

    // Remove existing listeners to prevent duplicates
    this.socket.removeAllListeners();
    
    // Prevent multiple event listener setups
    if (this.listenersSetup) {
      console.log('Event listeners already setup, skipping...');
      return;
    }
    this.listenersSetup = true;

    this.socket.on('connect', () => {
      console.log('Connected to server, authenticating...');
      this.isConnected = true;
      if (this.userId && this.userRole) {
        this.authenticate(this.userId, this.userRole);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.isConnected = false;
    });

    this.socket.on('authenticated', (data) => {
      console.log('Authentication response:', data);
      if (data.success) {
        toast.success(`Connected as ${this.userRole}`);
      } else {
        toast.error('Authentication failed');
      }
    });

    // Order notifications
    this.socket.on('newOrder', (data) => {
      console.log('Socket received newOrder event:', data);
      this.handleNewOrderNotification(data);
    });

    this.socket.on('orderStatusUpdate', (data) => {
      console.log('Socket received orderStatusUpdate event:', data);
      this.handleOrderStatusUpdateNotification(data);
    });

    // Payment notifications (for admin and cashier only)
    this.socket.on('paymentCompleted', (data) => {
      console.log('Socket received paymentCompleted event:', data);
      this.handlePaymentCompletedNotification(data);
    });

    // Order deletion notifications
    this.socket.on('orderDeleted', (data) => {
      console.log('Socket received orderDeleted event:', data);
      this.handleOrderDeletedNotification(data);
    });

    // Error handling
    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      toast.error('Failed to connect to server');
    });
  }

  // Handle new order notification
  handleNewOrderNotification(data) {
    console.log('Frontend received newOrder notification:', data);
    console.log('Current user role:', this.userRole);
    
    const { message, order, customerName } = data;
    
    // Add to Redux store for bell notifications
    if (this.dispatch) {
      const notificationId = `${order._id || Date.now().toString()}-newOrder`;
      this.dispatch(addNotification({
        id: notificationId,
        message: `New Order: ${customerName} - Table ${order.table?.number || 'N/A'}`,
        type: "info",
        timestamp: new Date().toISOString(),
        isRead: false
      }));
      console.log('Added notification to Redux store');
    }
    
    // Show different toast notifications based on user role
    switch (this.userRole?.toLowerCase()) {
      case 'admin':
        toast.info(`🆕 ${message}`, {
          position: "top-right",
          autoClose: 5000,
        });
        break;
      case 'cashier':
        toast.info(`💰 New Order: ${customerName} - Table ${order.table?.number || 'N/A'}`, {
          position: "top-right",
          autoClose: 5000,
        });
        break;
      case 'kitchen':
        toast.info(`👨‍🍳 New Order: Table ${order.table?.number || 'N/A'} - ${customerName}`, {
          position: "top-right",
          autoClose: 5000,
        });
        break;
      default:
        toast.info(message);
    }

    // Play notification sound
    this.playNotificationSound();
  }

  // Handle order status update notification
  handleOrderStatusUpdateNotification(data) {
    const { message, order, newStatus } = data;
    
    // Add to Redux store for bell notifications
    if (this.dispatch) {
      const notificationId = `${order._id || Date.now().toString()}-statusUpdate`;
      this.dispatch(addNotification({
        id: notificationId,
        message: `Order #${order._id?.slice(-6)} status: ${newStatus}`,
        type: newStatus === 'Ready' || newStatus === 'Completed' ? "success" : "info",
        timestamp: new Date().toISOString(),
        isRead: false
      }));
    }
    
    // Different toast notifications based on status and role
    switch (this.userRole?.toLowerCase()) {
      case 'admin':
        toast.info(`📋 ${message}`, {
          position: "top-right",
          autoClose: 4000,
        });
        break;
      case 'cashier':
        if (newStatus === 'Ready' || newStatus === 'Completed') {
          toast.success(`✅ Order #${order._id?.slice(-6)} is ${newStatus}`, {
            position: "top-right",
            autoClose: 4000,
          });
        } else {
          toast.info(`📋 Order #${order._id?.slice(-6)} status: ${newStatus}`, {
            position: "top-right",
            autoClose: 4000,
          });
        }
        break;
      case 'kitchen':
        if (newStatus === 'Ready') {
          toast.success(`👨‍🍳 Order Ready! Table ${order.table?.number || 'N/A'}`, {
            position: "top-right",
            autoClose: 6000,
          });
        } else {
          toast.info(`👨‍🍳 Table ${order.table?.number || 'N/A'} - Status: ${newStatus}`, {
            position: "top-right",
            autoClose: 4000,
          });
        }
        break;
    }

    this.playNotificationSound();
  }

  // Handle order deleted notification
  handleOrderDeletedNotification(data) {
    console.log('Frontend received orderDeleted notification:', data);
    console.log('Current user role:', this.userRole);
    
    const { message, order, customerName, tableNumber } = data;
    
    // Add to Redux store for bell notifications
    if (this.dispatch) {
      const notificationId = `${order._id || Date.now().toString()}-deleted`;
      this.dispatch(addNotification({
        id: notificationId,
        message: `Order Deleted: ${customerName} - Table ${tableNumber}`,
        type: "warning",
        timestamp: new Date().toISOString(),
        isRead: false
      }));
      console.log('Added order deletion notification to Redux store');
    }
    
    // Show different toast notifications based on user role
    switch (this.userRole?.toLowerCase()) {
      case 'admin':
        toast.warning(`🗑️ ${message}`, {
          position: "top-right",
          autoClose: 5000,
        });
        break;
      case 'cashier':
        toast.warning(`🗑️ Order Deleted: ${customerName} - Table ${tableNumber}`, {
          position: "top-right",
          autoClose: 5000,
        });
        break;
      case 'kitchen':
        toast.warning(`🗑️ Order Cancelled: Table ${tableNumber} - ${customerName}`, {
          position: "top-right",
          autoClose: 5000,
        });
        break;
      default:
        toast.warning(message);
    }

    // Play notification sound
    this.playNotificationSound();
  }

  // Handle payment completed notification (admin and cashier only)
  handlePaymentCompletedNotification(data) {
    if (this.userRole?.toLowerCase() !== 'admin' && this.userRole?.toLowerCase() !== 'cashier') {
      return; // Only admin and cashier should receive payment notifications
    }

    const { message, amount, paymentMethod, order } = data;
    
    // Add to Redux store for bell notifications
    if (this.dispatch) {
      const notificationId = `${order._id || Date.now().toString()}-payment`;
      this.dispatch(addNotification({
        id: notificationId,
        message: `Payment completed: ৳${amount} - Order #${order._id?.slice(-6)}`,
        type: "success",
        timestamp: new Date().toISOString(),
        isRead: false
      }));
    }
    
    toast.success(`💳 ${message}`, {
      position: "top-right",
      autoClose: 5000,
    });

    this.playNotificationSound();
  }

  // Play notification sound
  playNotificationSound() {
    try {
      // Create audio context for notification sound
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      console.log('Could not play notification sound:', error);
    }
  }

  // Subscribe to custom events
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  // Unsubscribe from events
  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  // Emit custom events
  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners(); // Remove all listeners before disconnecting
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.userRole = null;
      this.userId = null;
      this.dispatch = null;
      this.listenersSetup = false; // Reset listeners flag
    }
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      userRole: this.userRole,
      userId: this.userId
    };
  }
}

// Create singleton instance
const socketService = new SocketService();
export default socketService;
