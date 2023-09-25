
import { createContext, useContext, useEffect } from 'react';
import WebSocketService from '../services/WebSocketService';
import Cookies from 'js-cookie';
// import { useAppSelector } from "../store/hooks";
// import { RootState } from "../store/store";

const WebSocketContext = createContext<WebSocketService | undefined>(undefined);

// IUser let the username be undefined ? Added check on username value but not solid
// Also when the Redux state, the user comes as undefined at some point
// wrap everyting into a useEffect() to avoid the user being undefined probably because the cookies are not set yet
export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // const user = useAppSelector((state: RootState) => state.user.user);
  let webSocketService: WebSocketService | undefined = undefined;
  useEffect(() => {
    const user = Cookies.get('username');
    console.log('user', user);
    if (user)
    {
      webSocketService = new WebSocketService(user);
    return () => {
      // Clean up the WebSocket connection when unmounting
      if (webSocketService)
        webSocketService.disconnect();
    };
  }
}, [])
  return (
    <WebSocketContext.Provider value={webSocketService}>
      {children}
    </WebSocketContext.Provider>
  )
  }

export const useWebSocket = (): WebSocketService => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};