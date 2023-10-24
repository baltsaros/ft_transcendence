import Cookies from "js-cookie";
import React, { useRef, useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Socket, io } from "socket.io-client";
import WaitingGame from "../components/pong/WaitingGame";
import GameSettings from "../components/pong/GameSettings";
import { GameSettingsData, GameState, Room } from '../../../backend/src/gateway/entities/room';
import { selectCount } from "../store/user/userSlice";
import PongLauncher from "../components/pong/LaunchPong";
import { usePongWebSocket } from "../context/pong.websocket.context";
import { toast } from "react-toastify";

const GamePage: React.FC = () => {

	// let webSocket = new WebSocket("ws://localhost:3000/pong");

	const navigate = useNavigate();

	// webSocket.send()
	const webSocketRef = useRef<Socket | null>(null);
	const [modalView, setModalView] = useState<boolean>(true);
	const [showGameSettings, setShowGameSettings] = useState(false);
	const [launchGame, setLaunchGame] = useState(false);
	const [roomId, setRoomId] = useState<string | null>(null);
	const [radius, setRadius] = useState<number | null>(null);
	const [ballSpeed, setBallSpeed] = useState<number | null>(null);
	const [color, setColor] = useState<string | null>(null);

	const handleCloseModal = () => {
		setModalView(false);
	};

	if (!webSocketRef.current) {
		webSocketRef.current = io('ws://localhost:3000/pong', {
			query: {
				username: Cookies.get('username'),
			},
		});
	}

	useEffect(() => {

		webSocketRef.current?.on('matchmakingSuccess', (data: { roomId: string }) => {
			console.log(`Matchmaking successful. Room ID: ${data.roomId}`);
			setModalView(false);
			setRoomId(data.roomId);
			setShowGameSettings(true);
		});

		webSocketRef.current?.on('OpponentDisconnected', () =>
		{
			setModalView(true);
			setLaunchGame(false);
			setShowGameSettings(false);
			toast.error("Opponent disconnected.");
		});

		webSocketRef.current?.on('settingsSuccess', (data) => {
			setColor(data.color);
			setRadius(data.radius);
			setBallSpeed(data.ballSpeed);
			setShowGameSettings(false);
			setLaunchGame(true);
		});

		return () => {
			webSocketRef.current?.disconnect();
		  };
	}, []);

	return (
		<div className="game-container">
			{modalView && webSocketRef.current && !showGameSettings && (<WaitingGame onClose={handleCloseModal} webSocket={webSocketRef.current} />)}
			{showGameSettings && webSocketRef.current && !modalView && roomId && ( <GameSettings roomId={roomId} onClose={handleCloseModal} webSocket={webSocketRef.current}/> )}
			{launchGame && ballSpeed && radius && color && webSocketRef.current && roomId && (<PongLauncher ballSpeed={ballSpeed} radius={radius} color={color}/> )}
		</div>
	);
};

export default GamePage;