
import { useState, createContext, useContext, useEffect } from 'react';
import ChatWebSocketService from '../services/chat.websocket.service';
import Cookies from 'js-cookie';
import { getUser } from '../hooks/getUser';

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
      const user = Cookies.get("username");
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

/* Create a custom hook for consuming the context */
export const useChatWebSocket = (): ChatWebSocketService => {
  const context = useContext(ChatWebSocketContext);
  if (!context) {
    throw new Error('useChatWebSocket must be used within a ChatChatWebSocketProvider');
  }
  return context;
};

/* Wrap the components that need access to the context with the Provider (see main.tsx) */