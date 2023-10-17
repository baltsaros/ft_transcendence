import { useState, createContext, useContext, useEffect } from 'react';
import ChatWebSocketService from '../services/chat.websocket.service'; // Assurez-vous d'importer le service approprié
import Cookies from 'js-cookie';

/* Contexte */
const ChatWebSocketContext = createContext<ChatWebSocketService | undefined>(undefined);

/* Composant fournisseur (provider) */
export const ChatWebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  /* Définissez l'état/données à partager dans l'arborescence des composants React */
  const [chatWebSocketService, setChatWebSocketService] = useState<ChatWebSocketService | undefined>();

  useEffect(() => {
    const user = Cookies.get('username');
    console.log('user', user);
    if (user) {
      setChatWebSocketService(new ChatWebSocketService(user));
    }
    return () => {
      if (chatWebSocketService) {
        chatWebSocketService.disconnect();
      }
    };
  }, []);

  /* Utilisez le fournisseur pour envelopper les enfants (children) et transmettez les données partagées via la prop "value" */
  return (
    <ChatWebSocketContext.Provider value={chatWebSocketService}>
      {children}
    </ChatWebSocketContext.Provider>
  );
}

/* Créez un hook personnalisé pour consommer le contexte */
export const useChatWebSocket = (): ChatWebSocketService => {
  const context = useContext(ChatWebSocketContext);
  if (!context) {
    throw new Error('useChatWebSocket doit être utilisé dans un ChatWebSocketProvider');
  }
  return context;
};

/* Enveloppez les composants qui ont besoin d'accéder au contexte avec le fournisseur (voir main.tsx par exemple) */
