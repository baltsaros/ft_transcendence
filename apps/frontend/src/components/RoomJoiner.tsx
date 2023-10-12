import React, { useState } from "react";
import { useChatWebSocket } from "../context/ChatWebSocketContext";

const RoomJoiner = () => {
  const [roomName, setRoomName] = useState("");
  const webSocketService = useChatWebSocket();


  return (
    <div>
      <h2>Créer une salle de jeu</h2>
      {/* <input
        type="text"
        placeholder="Nom de la salle"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      /> */}
      {/* <button onClick={createRoom}>Créer la salle</button> */}
    </div>
  );
};

export default RoomJoiner;
