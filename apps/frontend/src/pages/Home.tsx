import { FC, useEffect, useState } from "react";
import ftLogo from "../assets/42_Logo.svg";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { useChatWebSocket } from "../context/chat.websocket.context";
import GameInvitation from "../components/pong/Invitation";
import { usePongWebSocket } from "../context/pong.websocket.context";
import WaitingGame from "../components/pong/WaitingGame";
import { AuthService } from "../services/auth.service";
import { toast } from "react-toastify";

const Home: FC = () => {
	const isAuth = useAuth();
	const chatWebSocketService = useChatWebSocket();
	const pongWebSocketService = usePongWebSocket();
	const [showWaitingGame, setShowWaitingGame] = useState<boolean>(false);
	const [gameInvitation, setGameInvitation] = useState<boolean>(false);
	const navigate = useNavigate();

	const updateOnlineStatus = async () => {

		const userUpdate = await AuthService.updateStatus("online");
		chatWebSocketService!.emit("updateStatus", {data: {userUpdate}});
	};

	const updateInGameStatus = async () => {
		const userUpdate = await AuthService.updateStatus("inGame");
		chatWebSocketService!.emit("updateStatus", {data: {userUpdate}});
	};

	const handleCloseWaitingGame = () => {
		if (isAuth)
			pongWebSocketService?.emit('removeFromQueue', {});
		setShowWaitingGame(false);
	};

	const handleOpenWaitingGame = () => {
		setShowWaitingGame(true);
		updateInGameStatus();
	};

	useEffect( () => {
		if (isAuth)
		{
			pongWebSocketService!.on('GameInvitationReceived', (data: { sender: string}) => {
				console.log("game invitation received. Sender : ", data.sender);
				setGameInvitation(true);
			});

			pongWebSocketService!.on('matchmakingError', (data: {error: string}) =>
			{
				handleCloseWaitingGame();
				toast.error(data.error);
			});
		}

		return () => {
			if (isAuth)
				pongWebSocketService?.off('GameInvitationReceived');
				pongWebSocketService?.off('matchmakingError');
		  };
	}, [pongWebSocketService, isAuth]);

  return (
    <>
      {!isAuth ? (
			<div className="flex flex-col items-center justify-center">
			<div className="grid grid-cols-3 gap-28">
				<div className="col-start-2 justify-self-center grid grid-rows-4 gap-10">
					<div></div>
					<div className="row-span-1">
						<a href="http://localhost:3000/api/auth/redir" className="relative">
							<div className="rounded-md bg-gray-500 p-4 group-hover:bg-opacity-70 transition-bg-opacity duration-300">
								<img src={ftLogo} className="logo w-40 h-40" alt="42 logo" />
								<p className="text-white text-lg font-bold">LOG IN</p>
							</div>
						</a>
					</div>
				</div>
			</div>
		</div>
      ) : (
		<div className=" grid grid-cols-3 gap-28">
			{gameInvitation && (<GameInvitation />)}
			{showWaitingGame && (<WaitingGame onClose={handleCloseWaitingGame} />)}
			<div className="col-start-2 justify-self-center grid grid-rows-4 gap-10">
			<div/>
			<div className="row-span-1">
					<button onClick={handleOpenWaitingGame} className="w-64 h-32 bg-gray-500 hover:bg-gray-600 text-gray-200 text-4xl font-bold rounded-lg transition-colors duration-300">PLAY</button>
			</div>
			 <div className="row-span-1">
				<Link to="/chat">
					<button className="w-64 h-32 bg-gray-500 hover:bg-gray-600 text-gray-200 text-4xl font-bold rounded-lg transition-colors duration-300">
						CHAT
					</button>
				</Link>
			</div>
			</div>
		</div>

      )}
    </>
  );
};

export default Home;