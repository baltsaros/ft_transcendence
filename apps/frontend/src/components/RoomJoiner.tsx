// MatchmakingPage.tsx

import React, { useEffect } from 'react';
import PongW from './ChatWebSocketService'; // Assurez-vous d'importer le bon service WebSocket

const MatchmakingPage: React.FC = () => {
  useEffect(() => {
    // Créez une instance du service WebSocket
    const webSocketService = new ChatWebSocketService('username'); // Remplacez 'username' par le nom d'utilisateur approprié

    // Lorsque le composant est monté, lancez l'événement "launchMatchmaking"
    const handlePlayClick = () => {
      webSocketService.emit('launchMatchmaking', {}); // Vous pouvez envoyer des données en fonction de vos besoins
    };

    // Le service WebSocket gère la connexion WebSocket et l'événement
    // "launchMatchmaking" sera intercepté côté serveur pour gérer la logique de matchmaking.

    // N'oubliez pas de nettoyer la connexion WebSocket lorsque le composant est démonté
    return () => {
      webSocketService.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Matchmaking Page</h1>
      <button onClick={handlePlayClick}>Play</button>
    </div>
  );
};

export default MatchmakingPage;
