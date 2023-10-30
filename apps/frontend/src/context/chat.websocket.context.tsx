
import { useState, createContext, useContext, useEffect } from 'react';
import ChatWebSocketService from '../services/chat.websocket.service';
import Cookies from 'js-cookie';

/* Context */
const ChatWebSocketContext = createContext<ChatWebSocketService | undefined>(undefined);

/* Provider component */
export const ChatWebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  // const getUserInfo = async () => {
  //   const user = getUser();
  //   return user;
  // }
  /* Define the state/data to share along the React component tree */
  const [ChatwebSocketService, setChatWebSocketService] = useState<ChatWebSocketService | undefined>();
  useEffect(() => {
    const user = Cookies.get('username');
      // console.log('user', user);
      if (user) {
        setChatWebSocketService(new ChatWebSocketService(user));
      }
    return () => {
      if (ChatwebSocketService) {
        ChatwebSocketService.disconnect();
      }
    };
  }, []);
/* Use the Provider to wrap the children and pass the shared data through value prop */
  return (
    <ChatWebSocketContext.Provider value={ChatwebSocketService}>
      {children}
    </ChatWebSocketContext.Provider>
  );
}

export const useChatWebSocket = (): ChatWebSocketService | undefined => {
  const context = useContext(ChatWebSocketContext);
  return context;
};
/* Create a custom hook for consuming the context */

/* Wrap the components that need access to the context with the Provider (see main.tsx) */