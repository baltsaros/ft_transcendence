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
import { Navigate, useNavigate, useParams } from "react-router-dom";

const GamePage: React.FC = () => {

	// const [showWaitingGame, setShowWaitingGame] = useState<boolean>(true);
	const [showGameSettings, setShowGameSettings] = useState<boolean>(true);
	const [matchEnded, setMatchEnded] = useState<boolean>(false);
	const [launchGame, setLaunchGame] = useState(false);
	// const [roomId, setRoomId] = useState<string | null>(null);
	const [opponentUsername, setOpponentUsername] = useState<string | null>(null);
	const [player1PaddleColor, setPlayer1PaddleColor] = useState<string | null>(null);
	const [player2PaddleColor, setPlayer2PaddleColor] = useState<string | null>(null);
	const [radius, setRadius] = useState<number | null>(null);
	const [player1, setPlayer1] = useState<string | null >(null);
	const [player2, setPlayer2] = useState<string | null >(null);
	const chatWebSocketService = useChatWebSocket();
	const pongWebSocketService = usePongWebSocket();
	const { roomId } = useParams();
	const navigate = useNavigate();
	// const handleCloseWaitingGame = () => {
	// 	pongWebSocketService!.emit('removeFromQueue', {});
	// 	setShowWaitingGame(false);
	// };

	const handleCloseSettingsGame = () => {
		pongWebSocketService!.emit('leavePong', {});
		// setRoomId(null);
		setRadius(null);
		setPlayer1PaddleColor(null);
		setPlayer2PaddleColor(null);
		setOpponentUsername(null);
		setShowGameSettings(false);
		navigate("/");
		// setShowWaitingGame(false);
	};

	// if (!pongWebSocketService!.current) {
	// 	pongWebSocketService!.current = io('ws://localhost:3000/pong', {
	// 		query: {
	// 			username: Cookies.get('username'),
	// 		},
	// 	});
	// }
	const updateOnlineStatus = async () => {

		const userUpdate = await AuthService.updateStatus("online");
		chatWebSocketService!.emit("updateStatus", {data: {userUpdate}});
	};

	useEffect(() => {

		// if (showWaitingGame)
		// 	updateInGameStatus();

		pongWebSocketService!.emit('validRoom', {data: {roomId: roomId}});

		pongWebSocketService!.on('RoomError', (data: {error: string}) => {
			toast.error(data.error);
			navigate("/");
		});
		pongWebSocketService!.on('MatchEnded', () =>
		{
			updateOnlineStatus();
		});

		pongWebSocketService!.on('OpponentDisconnected', () =>
		{
			// setShowWaitingGame(true);
			updateOnlineStatus();
			setLaunchGame(false);
			setShowGameSettings(false);
			toast.error("Opponent disconnected.");
			navigate("/");
		});

		pongWebSocketService!.on('settingsSuccess', (data: {radius: number, player1PaddleColor: string, player2PaddleColor: string, player1: string, player2: string}) => {
			setPlayer1PaddleColor(data.player1PaddleColor);
			setPlayer2PaddleColor(data.player2PaddleColor);
			setRadius(data.radius);
			setPlayer1(data.player1);
			setPlayer2(data.player2);
			console.log(data.player1);
			console.log(data.player2);

			setShowGameSettings(false);
			setLaunchGame(true);
		});

		return () => {
			pongWebSocketService!.off('matchmakingSuccess');
			pongWebSocketService!.off('matchmakingError');
			pongWebSocketService!.off('MatchEnded');
			pongWebSocketService!.off('OpponentDisconnected');
			pongWebSocketService!.off('settingsSuccess');
			pongWebSocketService!.emit('leavePong', {});
			updateOnlineStatus();
		  };
	}, []);

	return (
		<div className="game-container">
			{/* {showWaitingGame && !showGameSettings && (<WaitingGame onClose={handleCloseWaitingGame} />)} */}
			{showGameSettings && roomId && ( <GameSettings roomId={roomId} onClose={handleCloseSettingsGame} /> )}
			{launchGame && roomId && radius && player1 && player2 && player1PaddleColor && player2PaddleColor && (<PongLauncher roomId={roomId} radius={radius} player1PaddleColor={player1PaddleColor} player2PaddleColor={player2PaddleColor} player1={player1} player2={player2}/> )}
		</div>
	);
};

export default GamePage;