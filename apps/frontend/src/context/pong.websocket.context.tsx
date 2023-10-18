
import { useState, createContext, useContext, useEffect } from 'react';
import PongWebSocketService from '../services/pong.websocket.service';
import Cookies from 'js-cookie';

/* Context */
const PongWebSocketContext = createContext<PongWebSocketService | undefined>(undefined);

/* Provider component */
export const PongWebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  /* Define the state/data to share along the React component tree */
  const [PongwebSocketService, setPongWebSocketService] = useState<PongWebSocketService | undefined>();
  useEffect(() => {
    const user = Cookies.get('username');
      console.log('user', user);
      if (user) {
        setPongWebSocketService(new PongWebSocketService(user));
      }
    return () => {
      if (PongwebSocketService) {
        PongwebSocketService.disconnect();
      }
    };
  }, []);
/* Use the Provider to wrap the children and pass the shared data through value prop */
  return (
    <PongWebSocketContext.Provider value={PongwebSocketService}>
      {children}
    </PongWebSocketContext.Provider>
  );
}

/* Create a custom hook for consuming the context */
export const usePongWebSocket = (): PongWebSocketService => {
  const context = useContext(PongWebSocketContext);
  if (!context) {
    throw new Error('usePongWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

/* Wrap the components that need access to the context with the Provider (see main.tsx) */