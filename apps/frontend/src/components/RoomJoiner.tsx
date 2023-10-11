import React, { useState } from "react";
import { useWebSocket } from "../context/WebSocketContext";

const RoomJoiner = () => {
  const [roomName, setRoomName] = useState("");
  const webSocketService = useWebSocket();

  const createRoom = () => {
    // Envoie une demande de création de salle au serveur via WebSocket
    if (roomName.trim() !== "") {
      webSocketService.createRoom(roomName);
    }
  };

  return (
    <div>
      <h2>Créer une salle de jeu</h2>
      <input
        type="text"
        placeholder="Nom de la salle"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <button onClick={createRoom}>Créer la salle</button>
    </div>
  );
};

export default RoomJoiner;
