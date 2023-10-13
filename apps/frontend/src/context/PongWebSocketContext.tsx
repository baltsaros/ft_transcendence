// PongWebSocketContext.tsx
import React, { useState, createContext, useContext, useEffect } from 'react';
import PongWebSocketService from '../services/pong.websocket.service';
import Cookies from 'js-cookie';

const PongWebSocketContext = createContext<PongWebSocketService | undefined>(undefined);

export const PongWebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

	const [pongWebSocketService, setPongWebSocketService] = useState<PongWebSocketService | undefined>();

  useEffect(() => {
    const user = Cookies.get('username');
	console.log('user', user);
    if (user) {
      setPongWebSocketService(new PongWebSocketService(user));
    }

    return () => {
      if (pongWebSocketService) {
        pongWebSocketService.disconnect();
      }
    };
  }, []);

  return (
    <PongWebSocketContext.Provider value={pongWebSocketService}>
      {children}
    </PongWebSocketContext.Provider>
  );
};

export const usePongWebSocket = (): PongWebSocketService => {
  const context = useContext(PongWebSocketContext);
  if (!context) {
    throw new Error('usePongWebSocket must be used within a PongWebSocketProvider');
  }
  return context;
};
