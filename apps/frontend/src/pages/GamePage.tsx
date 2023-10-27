import Cookies from "js-cookie";
import React, { useRef, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import WaitingGame from "../components/pong/WaitingGame";
import GameSettings from "../components/pong/GameSettings";
import { GameSettingsData } from '../../../backend/src/gateway/entities/room';
import PongLauncher from "../components/pong/LaunchPong";
import { toast } from "react-toastify";

const GamePage: React.FC = () => {

	const webSocketRef = useRef<Socket | null>(null);
	const [modalView, setModalView] = useState<boolean>(true);
	const [showGameSettings, setShowGameSettings] = useState<boolean>(false);
	const [matchEnded, setMatchEnded] = useState<boolean>(false);
	const [launchGame, setLaunchGame] = useState(false);
	const [roomId, setRoomId] = useState<string | null>(null);
	const [gameSettingsData, setGameSettingsData] = useState<GameSettingsData | null>(null);
	const [radius, setRadius] = useState<number | null>(null);
	const [ballSpeed, setBallSpeed] = useState<number | null>(null);
	const [color, setColor] = useState<string | null>(null);
	const [opponentUsername, setOpponentUsername] = useState<string | null>(null);
	const [userPaddleColor, setUserPaddleColor] = useState<string | null>(null);
	const [opponentPaddleColor, setOpponentPaddleColor] = useState<string | null>(null);

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

		webSocketRef.current?.on('settingsSuccess', (data: {userPaddleColor:string, opponentPaddleColor: string}) => {
			setUserPaddleColor(data.userPaddleColor);
			setOpponentPaddleColor(data.opponentPaddleColor);

			console.log(`${Cookies.get('username')} paddle color : ${data.userPaddleColor}`);
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
			{launchGame && gameSettingsData && webSocketRef.current && roomId && !matchEnded && (<PongLauncher webSocket={webSocketRef.current} roomId={roomId} gameSettings={gameSettingsData}/> )}
		</div>
	);
};

export default GamePage;