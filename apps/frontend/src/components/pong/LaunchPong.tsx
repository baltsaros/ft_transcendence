import Cookies from "js-cookie";
import React, { useRef, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Socket } from "socket.io-client";
import { MatchService } from "../../services/matches.service";
import { PlayerService } from "../../services/player.service";

const colors = ["white", "teal", "yellow", "orange", "red", "green", "purple"];
const scoreMax = 5;
const fieldWidth = 800;
const fieldHeight = 600;
const paddleWidth = 10;
const paddleHeight = 100;
const paddleOffset = 5;
const paddleSpeed = 20;
const username = Cookies.get('username');

const PongLauncher = ({ webSocket, roomId, radius, player1PaddleColor, player2PaddleColor, opponent}: any) => {

	// STATE
	const [matchStarted, setMatchStarted] = useState<boolean>(false);
	const [matchEnded, setMatchEnded] = useState<boolean>(false);

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const ballXRef = useRef(fieldWidth / 2);
	const ballYRef = useRef(fieldHeight / 2);
	const leftPaddleYRef = useRef(fieldHeight / 2 - paddleHeight / 2);
	const rightPaddleYRef = useRef(fieldHeight / 2 - paddleHeight / 2);
	const player1ScoreRef = useRef(0);
	const player2ScoreRef = useRef(0);

	useEffect(() => {
		  // Démarrez la partie lorsque le composant est monté
		  webSocket.emit('startMatch', { data: { roomId: roomId } });
	  }, [webSocket, roomId]);

	useEffect(() => {
		webSocket.on('matchEnded', (data: {userScore: number, opponentScore: number}) => {
			setMatchEnded(true);

			if (username && data.userScore > data.opponentScore)
			{
				MatchService.addMatch({
					username: username,
					opponent: opponent,
					scoreUser: data.userScore,
					scoreOpponent: data.opponentScore
				});
			}
		});
		return () => {
			webSocket.off("matchEnded");
		};
	});


	useEffect(() => {
			const canvas = canvasRef.current;

			if (!canvas)
				return;

			const ctx = canvas.getContext("2d");
			if (!ctx)
				return;

			webSocket.on('pongUpdate', (data: {ballX: number, ballY: number, leftPaddleY: number, rightPaddleY: number, userScore: number, opponentScore: number}) => {
					ballXRef.current = data.ballX;
					ballYRef.current = data.ballY;
					leftPaddleYRef.current = data.leftPaddleY;
					rightPaddleYRef.current = data.rightPaddleY;
					player1ScoreRef.current = data.userScore;
					player2ScoreRef.current = data.opponentScore;

					console.log("ball x : ", data.ballX);
					console.log("ball y : ", data.ballY);
					console.log("left paddle y : ", data.leftPaddleY);
					console.log("right paddle y : ", data.rightPaddleY);
					console.log("user score : ", data.userScore);
					console.log("opponent score : ", data.opponentScore);

					const ballX = ballXRef.current;
					const ballY = ballYRef.current;
					const leftPaddleY = leftPaddleYRef.current;
					const rightPaddleY = rightPaddleYRef.current;

					// Dessinez le terrain
					ctx.clearRect(0, 0, fieldWidth, fieldHeight);
					ctx.fillStyle = "black";
					ctx.fillRect(0, 0, fieldWidth, fieldHeight);
					ctx.globalAlpha = 0.2;
					ctx.fillStyle = "white";
					ctx.font = "200px Arial"
					ctx.fillText("PONG", 110, fieldHeight / 2 + 50);
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

			});


			const moveUser = (e: KeyboardEvent) => {
				const up = "up";
				const down = "down";

				if (e.key === "w")
					webSocket.emit('movePaddle', {data : {direction : up, roomId: roomId}});
				else if (e.key === "s")
					webSocket.emit('movePaddle', {data : {direction : down, roomId: roomId}});
			};

			// Écoutez les touches de contrôle des raquettes
			window.addEventListener("keydown", moveUser);

		return () => {
			webSocket.off('pongUpdate');
			window.removeEventListener("keydown", moveUser);
			};
	}, [webSocket]);

//   useEffect(() => {
//     webSocket.on('pongUpdate', (data: {ballX: number, ballY: number, leftPaddleY: number, rightPaddleY: number, userScore: number, opponentScore: number}) => {
// 		ballXRef.current = data.ballX;
// 		ballYRef.current = data.ballY;
// 		leftPaddleYRef.current = data.leftPaddleY;
// 		rightPaddleYRef.current = data.rightPaddleY;
// 		player1ScoreRef.current = data.userScore;
// 		player2ScoreRef.current = data.opponentScore;
// 	});

    // Clean up the socket connection when the component unmounts
//     return () => {
//       webSocket.off('pongUpdate');
//     };
//   }, []);

	return (
		matchEnded ?
		(
			<div className="game-container">
				<div className="fixed z-10 inset-0 bg-gray-500 bg-opacity-40 overflow-y-auto flex items-center justify-center" aria-labelledby="modal-title" role="dialog" aria-modal="true">
					<div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg w-full">
						<div className="bg-gray-600 p-4">
							<h3 className="text-3xl font-semibold leading-6 uppercase text-gray-400 text-center" id="modal-title">Match Result</h3>
						</div>
						<div className="bg-gray-400 p-6 space-y-3 text-center">
							<p className="text-2xl text-black font-bold"> {username} vs {opponent}</p>
							<div className="flex justify-center items-center space-x-4">
								<p className="text-4xl text-black font-bold">{player1ScoreRef.current}</p>
								<p className="text-4xl text-red-600 font-bold">-</p>
								<p className="text-4xl text-black font-bold">{player2ScoreRef.current}</p>
							</div>
						</div>
						<div className="bg-gray-400 px-4 py-3 text-center">
							<Link to={"/"} className="col-span-3 text-center">
								<button type="button" style={{ transition: 'all .15s ease' }} className="inline-flex mx-auto rounded-md items-center bg-red-600 text-white px-3 py-2 text-sm font-semibold hover:bg-red-500">Leave</button>
							</Link>
						</div>
					</div>
				</div>
			</div>

		) : (
		<div className="game-container">
			<div className="flex justify-center items-center h-screen">
				<canvas ref={canvasRef} width={fieldWidth} height={fieldHeight} style={{ border: "5px solid white" }}></canvas>
			</div>
		</div>
		)
	);
};

export default PongLauncher;