import Cookies from "js-cookie";
import { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Player from "../../pages/Player";
import { AuthService } from "../../services/auth.service";
import { MatchService } from "../../services/matches.service";
import { PlayerService } from "../../services/player.service";
import { RootState, store } from "../../store/store";
import { fetchAllUsers } from "../../store/user/allUsersSlice";
import { usePongWebSocket } from "../../context/pong.websocket.context";
import { useChatWebSocket } from "../../context/chat.websocket.context";

const scoreMax = 5;
const fieldWidth = 800;
const fieldHeight = 600;
const paddleWidth = 10;
const paddleHeight = 100;
const paddleOffset = 5;
const paddleSpeed = 20;
const username = Cookies.get('username');

const PongLauncher = ({ onClose, roomId, radius, player1PaddleColor, player2PaddleColor, player1, player2}: any) => {

	// STATE
	const [matchStarted, setMatchStarted] = useState<boolean>(false);
	const [matchEnded, setMatchEnded] = useState<boolean>(false);
	const pongWebSocketService = usePongWebSocket();
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const ballXRef = useRef(fieldWidth / 2);
	const ballYRef = useRef(fieldHeight / 2);
	const leftPaddleYRef = useRef(fieldHeight / 2 - paddleHeight / 2);
	const rightPaddleYRef = useRef(fieldHeight / 2 - paddleHeight / 2);
	const player1ScoreRef = useRef(0);
	const player2ScoreRef = useRef(0);
	const users = useSelector((state: RootState) => state.allUser.users);
	const chatWebSocketService = useChatWebSocket();


	const updateOnlineStatus = async () => {
		const userUpdate = await AuthService.updateStatus("online");
		chatWebSocketService!.emit("updateStatus", {data: {userUpdate}});
	};

	const handleClose = () => {
		updateOnlineStatus();
		onClose();
	};
	useEffect(() => {
		store.dispatch(fetchAllUsers());
	}, []);

	useEffect(() => {
		  // Démarrez la partie lorsque le composant est monté
		  pongWebSocketService?.emit('startMatch', { data: { roomId: roomId } });

		//   pongWebSocketService!.on('matchStarted', (data: { player1Username: string, player2Username: string}) => {
		// 	// setShowWaitingGame(false);
		// 	setPlayer1(data.player1Username);
		// 	setPlayer2(data.player2Username);
		// });
	  }, [pongWebSocketService]);

	const calculateNewElo = async (scoreDifference: number) => {
		let player = await AuthService.getProfile();
		if (player) {
			let kFactor: number;

			if (player.rank < 1200)
			{
				if (scoreDifference > 0)
					kFactor = 60;
				else
					kFactor = 20;
			}
			else if (player.rank < 1800)
			{
				kFactor = 40;
			}
			else
			{
				if (scoreDifference > 0)
					kFactor = 20;
				else
					kFactor = 60;
			}

			if (player.rank + scoreDifference * kFactor < 0)
				player.rank = 0;
			else
				player.rank += scoreDifference * kFactor;
			PlayerService.updateElo(player);
		}
	};

	useEffect(() => {
			const canvas = canvasRef.current;

			if (!canvas)
				return;

			const ctx = canvas.getContext("2d");
			if (!ctx)
				return;

				pongWebSocketService!.on('pongUpdate', (data: {ballX: number, ballY: number, leftPaddleY: number, rightPaddleY: number, player1Score: number, player2Score: number}) => {
					ballXRef.current = data.ballX;
					ballYRef.current = data.ballY;
					leftPaddleYRef.current = data.leftPaddleY;
					rightPaddleYRef.current = data.rightPaddleY;
					player1ScoreRef.current = data.player1Score;
					player2ScoreRef.current = data.player2Score;

					const ballX = ballXRef.current;
					const ballY = ballYRef.current;
					const leftPaddleY = leftPaddleYRef.current;
					const rightPaddleY = rightPaddleYRef.current;

					if (!matchEnded && (player1ScoreRef.current == scoreMax || player2ScoreRef.current == scoreMax))
					{
						if (player1 == username)
						{
							if (player1 && player2)
							{
								MatchService.addMatch({
									username: player1,
									opponent: player2,
									scoreUser: player1ScoreRef.current,
									scoreOpponent: player2ScoreRef.current
								});
							}
							calculateNewElo(player1ScoreRef.current - player2ScoreRef.current);
						}
						else if (player2 == username)
						{
							calculateNewElo(player2ScoreRef.current - player1ScoreRef.current);
						}
						setMatchEnded(true);
					}
					else
					{
						// Dessinez le terrain
						ctx.clearRect(0, 0, fieldWidth, fieldHeight);
						ctx.fillStyle = "black";
						ctx.fillRect(0, 0, fieldWidth, fieldHeight);
						ctx.globalAlpha = 0.2;
						ctx.fillStyle = "white";
						// ctx.font = "200px Arial"
						// ctx.fillText("PONG", 110, fieldHeight / 2 + 50);
						ctx.globalAlpha = 1;

						// Dessinez la ligne verticale blanche pointillée au milieu du terrain
						ctx.strokeStyle = "white";
						ctx.setLineDash([5, 15]); // Motif de ligne pointillée
						ctx.beginPath();
						ctx.moveTo(fieldWidth / 2, 0);
						ctx.lineTo(fieldWidth / 2, fieldHeight);
						ctx.stroke();
						ctx.setLineDash([]); // Réinitialisez le motif de ligne

						// Dessinez les raquettes
						ctx.fillStyle = player1PaddleColor;
						ctx.fillRect(paddleOffset, leftPaddleY, paddleWidth, paddleHeight);

						ctx.fillStyle = player2PaddleColor;
						ctx.fillRect(fieldWidth - paddleWidth - paddleOffset, rightPaddleY, paddleWidth, paddleHeight);

						// Dessinez la balle
						ctx.fillStyle = "white";
						ctx.beginPath();
						ctx.arc(ballX, ballY, radius, 0, 2 * Math.PI);
						ctx.fill();

						// Dessinez les scores sur le canvas
						ctx.font = "50px Arial";
						ctx.fillText(`${player1ScoreRef.current}`, fieldWidth / 2 - 50, 50);
						ctx.fillText(`${player2ScoreRef.current}`, fieldWidth / 2 + 20, 50);

						ctx.font = "20px Arial";
						ctx.fillText(`${player1}`, 35, 35);
						ctx.fillText(`${player2}`, fieldWidth - 120, 35);

					}


			});
			const moveUser = (e: KeyboardEvent) => {
				e.preventDefault();
				if (e.key === "ArrowUp")
					pongWebSocketService!.emit('movePaddle', {data : {direction : "up", roomId: roomId}});
				else if (e.key === "ArrowDown")
					pongWebSocketService!.emit('movePaddle', {data : {direction : "down", roomId: roomId}});
			};

			// Écoutez les touches de contrôle des raquettes
			window.addEventListener("keydown", moveUser);

		return () => {
			pongWebSocketService!.off('pongUpdate');
			window.removeEventListener("keydown", moveUser);
			};
	}, [pongWebSocketService!]);

	return (
		(matchEnded && player1 && player2) ?
		(
			<div className="game-container">
				<div className="fixed z-10 inset-0 bg-gray-500 bg-opacity-40 overflow-y-auto flex items-center justify-center" aria-labelledby="modal-title" role="dialog" aria-modal="true">
					<div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg w-full">
						<div className="bg-gray-600 p-4">
							<h3 className="text-3xl font-semibold leading-6 uppercase text-gray-400 text-center" id="modal-title">Match Result</h3>
						</div>
						<div className="bg-gray-400 p-6 space-y-3 text-center">
							<p className="text-2xl text-black font-bold"> {player1} vs {player2}</p>
							<div className="flex justify-center items-center space-x-4">
								<p className="text-4xl text-black font-bold">{player1ScoreRef.current}</p>
								<p className="text-4xl text-red-600 font-bold">-</p>
								<p className="text-4xl text-black font-bold">{player2ScoreRef.current}</p>
							</div>
						</div>
						<div className="bg-gray-400 px-4 py-3 text-center">
								<button type="button" onClick={handleClose} style={{ transition: 'all .15s ease' }} className="inline-flex mx-auto rounded-md items-center bg-red-600 text-white px-3 py-2 text-sm font-semibold hover:bg-red-500">Leave</button>
						</div>
					</div>
				</div>
			</div>
		) : (
			<div className="bg-gray-600 flex flex-col items-center pb-16 mt-20 rounded-md">
				<div className="mb-4 mt-4 text-white text-left text-lg font-semibold">
					<p><span className="text-green-400">⬆️</span> to move up</p>
					<p><span className="text-red-400">⬇️</span> to move down</p>
				</div>
				<div className="relative bg-black shadow-2xl">
					<canvas
						ref={canvasRef}
						width={fieldWidth}
						height={fieldHeight}
						className="border-4 border-white rounded-md"
					></canvas>
				</div>
			</div>
		)
	);
};

export default PongLauncher;