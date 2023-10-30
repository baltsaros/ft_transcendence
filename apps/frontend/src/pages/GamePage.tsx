import Cookies from "js-cookie";
import React, { useRef, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import WaitingGame from "../components/pong/WaitingGame";
import GameSettings from "../components/pong/GameSettings";
import { GameSettingsData } from "../../../backend/src/gateway/entities/room";
import PongLauncher from "../components/pong/LaunchPong";
import { toast } from "react-toastify";
import { AuthService } from "../services/auth.service";
import { useChatWebSocket } from "../context/chat.websocket.context";

const GamePage: React.FC = () => {
  const webSocketRef = useRef<Socket | null>(null);
  const [modalView, setModalView] = useState<boolean>(true);
  const [showGameSettings, setShowGameSettings] = useState<boolean>(false);
  const [matchEnded, setMatchEnded] = useState<boolean>(false);
  const [launchGame, setLaunchGame] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [opponentUsername, setOpponentUsername] = useState<string | null>(null);
  const [player1PaddleColor, setPlayer1PaddleColor] = useState<string | null>(
    null
  );
  const [player2PaddleColor, setPlayer2PaddleColor] = useState<string | null>(
    null
  );
  const [radius, setRadius] = useState<number | null>(null);
  const webSocketService = useChatWebSocket();

  const handleCloseModal = () => {
    setModalView(false);
  };

  if (!webSocketRef.current) {
    webSocketRef.current = io("ws://localhost:3000/pong", {
      query: {
        username: Cookies.get("username"),
      },
    });
  }

  const updateInGameStatus = async () => {
    const userUpdate = await AuthService.updateStatus("inGame");
    if (webSocketService)
      webSocketService.emit("updateStatus", { data: { userUpdate } });
  };

  const updateOnlineStatus = async () => {
    const userUpdate = await AuthService.updateStatus("online");
    if (webSocketService)
      webSocketService.emit("updateStatus", { data: { userUpdate } });
  };

  useEffect(() => {
    webSocketRef.current?.on(
      "matchmakingSuccess",
      (data: { roomId: string; opponentUsername: string }) => {
        setModalView(false);
        setRoomId(data.roomId);
        setShowGameSettings(true);
        setOpponentUsername(data.opponentUsername);
        updateInGameStatus();
      }
    );

    webSocketRef.current?.on("MatchEnded", () => {
      // setRoomId(null);
      // setOpponentUsername(null);
      updateOnlineStatus();
    });

    webSocketRef.current?.on("OpponentDisconnected", () => {
      setModalView(true);
      setLaunchGame(false);
      setShowGameSettings(false);
      // setRoomId(null);
      // setOpponentUsername(null);
      updateOnlineStatus();
      toast.error("Opponent disconnected.");
    });

    webSocketRef.current?.on(
      "settingsSuccess",
      (data: {
        radius: number;
        player1PaddleColor: string;
        player2PaddleColor: string;
      }) => {
        setPlayer1PaddleColor(data.player1PaddleColor);
        setPlayer2PaddleColor(data.player2PaddleColor);
        setRadius(data.radius);

        webSocketRef.current?.on("MatchEnded", () => {
          updateOnlineStatus();
        });

        webSocketRef.current?.on("OpponentDisconnected", () => {
          setModalView(true);
          setLaunchGame(false);
          setShowGameSettings(false);
          updateOnlineStatus();
          toast.error("Opponent disconnected.");
        });
        setShowGameSettings(false);
        setLaunchGame(true);
      }
    );

    return () => {
      updateOnlineStatus();
      webSocketRef.current?.disconnect();
    };
  }, []);

  return (
    <div className="game-container">
      {modalView && webSocketRef.current && !showGameSettings && (
        <WaitingGame
          onClose={handleCloseModal}
          webSocket={webSocketRef.current}
        />
      )}
      {showGameSettings && webSocketRef.current && !modalView && roomId && (
        <GameSettings
          roomId={roomId}
          onClose={handleCloseModal}
          webSocket={webSocketRef.current}
        />
      )}
      {launchGame &&
        webSocketRef.current &&
        roomId &&
        radius &&
        opponentUsername &&
        player1PaddleColor &&
        player2PaddleColor && (
          <PongLauncher
            webSocket={webSocketRef.current}
            roomId={roomId}
            radius={radius}
            player1PaddleColor={player1PaddleColor}
            player2PaddleColor={player2PaddleColor}
            opponent={opponentUsername}
          />
        )}
    </div>
  );
};

export default GamePage;
