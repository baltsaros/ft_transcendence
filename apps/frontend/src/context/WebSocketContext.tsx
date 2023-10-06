
import { useState, createContext, useContext, useEffect } from 'react';
import WebSocketService from '../services/WebSocketService';
import Cookies from 'js-cookie';

const WebSocketContext = createContext<WebSocketService | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [webSocketService, setWebSocketService] = useState<WebSocketService | undefined>();
  useEffect(() => {
    const user = Cookies.get('username');
      console.log('user', user);
      if (user) {
        setWebSocketService(new WebSocketService(user));
      }
      // return undefined;
    return () => {
      if (webSocketService) {
        webSocketService.disconnect();
      }
    };
  }, []);

  return (
    <WebSocketContext.Provider value={webSocketService}>
      {children}
    </WebSocketContext.Provider>
  );
}

export const useWebSocket = (): WebSocketService => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};