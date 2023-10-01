
import { useState, createContext, useContext, useEffect } from 'react';
import WebSocketService from '../services/WebSocketService';
import Cookies from 'js-cookie';

/* Context */
const WebSocketContext = createContext<WebSocketService | undefined>(undefined);

/* Provider component */
export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  /* Define the state/data to share along the React component tree */
  const [webSocketService, setWebSocketService] = useState<WebSocketService | undefined>();
  useEffect(() => {
    const user = Cookies.get('username');
      console.log('user', user);
      if (user) {
        setWebSocketService(new WebSocketService(user));
      }
    return () => {
      if (webSocketService) {
        webSocketService.disconnect();
      }
    };
  }, []);
/* Use the Provider to wrap the children and pass the shared data through value prop */
  return (
    <WebSocketContext.Provider value={webSocketService}>
      {children}
    </WebSocketContext.Provider>
  );
}

/* Create a custom hook for consuming the context */
export const useWebSocket = (): WebSocketService => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

/* Wrap the components that need access to the context with the Provider (see main.tsx) */