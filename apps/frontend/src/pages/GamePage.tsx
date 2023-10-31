import Cookies from "js-cookie";
import React, { useRef, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import WaitingGame from "../components/pong/WaitingGame";
import GameSettings from "../components/pong/GameSettings";
import { GameSettingsData } from '../../../backend/src/gateway/entities/room';
import PongLauncher from "../components/pong/LaunchPong";
import { toast } from "react-toastify";
import { AuthService } from "../services/auth.service";
import { useChatWebSocket } from "../context/chat.websocket.context";
import { usePongWebSocket } from "../context/pong.websocket.context";

const GamePage: React.FC = () => {

	const [showWaitingGame, setShowWaitingGame] = useState<boolean>(true);
	const [showGameSettings, setShowGameSettings] = useState<boolean>(false);
	const [matchEnded, setMatchEnded] = useState<boolean>(false);
	const [launchGame, setLaunchGame] = useState(false);
	const [roomId, setRoomId] = useState<string | null>(null);
	const [opponentUsername, setOpponentUsername] = useState<string | null>(null);
	const [player1PaddleColor, setPlayer1PaddleColor] = useState<string | null>(null);
	const [player2PaddleColor, setPlayer2PaddleColor] = useState<string | null>(null);
	const [radius, setRadius] = useState<number | null>(null);
	const chatWebSocketService = useChatWebSocket();
	const pongWebSocketService = usePongWebSocket();

	const handleCloseWaitingGame = () => {
		pongWebSocketService!.emit('removeFromQueue', {});
		setShowWaitingGame(false);
	};

	const handleCloseSettingsGame = () => {
		pongWebSocketService!.emit('leavePong', {});
		setRoomId(null);
		setRadius(null);
		setPlayer1PaddleColor(null);
		setPlayer2PaddleColor(null);
		setOpponentUsername(null);
		setShowGameSettings(false);
		setShowWaitingGame(false);
	};

	// if (!pongWebSocketService!.current) {
	// 	pongWebSocketService!.current = io('ws://localhost:3000/pong', {
	// 		query: {
	// 			username: Cookies.get('username'),
	// 		},
	// 	});
	// }

	const updateInGameStatus = async () => {
		const userUpdate = await AuthService.updateStatus("inGame");
		chatWebSocketService!.emit("updateStatus", {data: {userUpdate}});
	};

	const updateOnlineStatus = async () => {

		const userUpdate = await AuthService.updateStatus("online");
		chatWebSocketService!.emit("updateStatus", {data: {userUpdate}});
	};

	useEffect(() => {

		if (showWaitingGame)
			updateInGameStatus();

		pongWebSocketService!.on('matchmakingSuccess', (data: { roomId: string, opponentUsername: string }) => {
			setShowWaitingGame(false);
			setRoomId(data.roomId);
			setShowGameSettings(true);
			setOpponentUsername(data.opponentUsername);
		});

		pongWebSocketService!.on('MatchEnded', () =>
		{
			updateOnlineStatus();
		});

		pongWebSocketService!.on('OpponentDisconnected', () =>
		{
			setShowWaitingGame(true);
			setLaunchGame(false);
			setShowGameSettings(false);
			toast.error("Opponent disconnected.");
		});

		pongWebSocketService!.on('settingsSuccess', (data: {radius: number, player1PaddleColor: string, player2PaddleColor: string}) => {
			setPlayer1PaddleColor(data.player1PaddleColor);
			setPlayer2PaddleColor(data.player2PaddleColor);
			setRadius(data.radius);

			setShowGameSettings(false);
			setLaunchGame(true);
		});

		return () => {
			pongWebSocketService!.off('matchmakingSuccess');
			pongWebSocketService!.off('MatchEnded');
			pongWebSocketService!.off('OpponentDisconnected');
			pongWebSocketService!.off('settingsSuccess');
			pongWebSocketService!.emit('leavePong', {});
			updateOnlineStatus();
		  };
	}, []);

	return (
		<div className="game-container">
			{showWaitingGame && !showGameSettings && (<WaitingGame onClose={handleCloseWaitingGame} />)}
			{showGameSettings && !showWaitingGame && roomId && ( <GameSettings roomId={roomId} onClose={handleCloseSettingsGame}/> )}
			{launchGame && roomId && radius && opponentUsername && player1PaddleColor && player2PaddleColor && (<PongLauncher roomId={roomId} radius={radius} player1PaddleColor={player1PaddleColor} player2PaddleColor={player2PaddleColor} opponent={opponentUsername}/> )}
		</div>
	);
};

export default GamePage;