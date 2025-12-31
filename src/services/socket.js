import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  autoConnect: false,
});

export const connectSocket = () => {
  if (!socket.connected) {
    console.log('Connecting to socket...');
    socket.connect();
    socket.on('connect', () => {
      console.log('Socket connected successfully');
    });
    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  } else {
    console.log('Socket already connected');
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export const subscribeToNewsUpdates = (callback) => {
  socket.on('newsUpdate', callback);
  return () => socket.off('newsUpdate', callback);
};

export const subscribeToFeedbackUpdates = (callback) => {
  console.log('Subscribing to feedback updates');
  socket.on('feedbackUpdate', (data) => {
    console.log('Received feedbackUpdate event:', data);
    callback();
  });
  return () => {
    console.log('Unsubscribing from feedback updates');
    socket.off('feedbackUpdate', callback);
  };
};

export const subscribeToNotifications = (callback) => {
  socket.on('notification', callback);
  return () => socket.off('notification', callback);
};

export default socket;