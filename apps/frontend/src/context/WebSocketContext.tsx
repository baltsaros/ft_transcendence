
import { useState, createContext, useContext, useEffect } from 'react';
import WebSocketService from '../services/WebSocketService';
import Cookies from 'js-cookie';

const WebSocketContext = createContext<WebSocketService | undefined>(undefined);

/* IUser let the username be undefined ? Added check on username value but not solid
 Also when the Redux state, the user comes as undefined at some point
wrap everyting into useEffect() to avoid 'undefined'*/
export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [webSocketService, setWebSocketService] = useState<WebSocketService | undefined>(
    () => {
      const user = Cookies.get('username');
      console.log('user', user);
      if (user) {
        return new WebSocketService(user);
      }
      return undefined;
    }
  );
  useEffect(() => {
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