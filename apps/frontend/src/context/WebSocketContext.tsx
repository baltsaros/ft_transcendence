
import { createContext, useContext, useEffect } from 'react';
import WebSocketService from '../services/WebSocketService'; // Import your WebSocket service

const WebSocketContext = createContext<WebSocketService | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const webSocketService = new WebSocketService();
    
  useEffect(() => {
    return () => {
      // Clean up the WebSocket connection when unmounting
      webSocketService.disconnect();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={webSocketService}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketService => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};