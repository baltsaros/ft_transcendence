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

const PongLauncher = ({ gameSettings, webSocket, roomId, opponent}: any) => {

	// STATE
	const [matchEnded, setMatchEnded] = useState<boolean>(false);

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const ballSpeedRef = gameSettings.ballSpeed;
	const ballXRef = useRef(fieldWidth / 2);
	const ballYRef = useRef(fieldHeight / 2);
	const ballSpeedXRef = useRef(ballSpeedRef);
	const ballSpeedYRef = useRef(ballSpeedRef);
	const leftPaddleYRef = useRef(fieldHeight / 2 - paddleHeight / 2);
	const rightPaddleYRef = useRef(fieldHeight / 2 - paddleHeight / 2);
	const userPaddle = useRef("");
	const opponentPaddle  = useRef("");
	const userScoreRef = useRef(0);
	const opponentScoreRef = useRef(0);

	// const movePaddles = (paddle: string, direction: string) =>
	// {
	// 	if (paddle === "left")
	// 	{
	// 		if (direction === "up")
	// 			leftPaddleYRef.current = Math.max(0, leftPaddleYRef.current - paddleSpeed);
	// 		else if (direction === "down")
	// 			leftPaddleYRef.current = Math.min(fieldHeight - paddleHeight, leftPaddleYRef.current + paddleSpeed);
	// 	}
	// 	else if (paddle === "right")
	// 	{
	// 		if (direction === "up")
	// 			rightPaddleYRef.current = Math.max(0, rightPaddleYRef.current - paddleSpeed);
	// 		else if (direction === "down")
	// 			rightPaddleYRef.current = Math.min(fieldHeight - paddleHeight, rightPaddleYRef.current + paddleSpeed);
	// 	}
	// }

	// const moveUser = (e: KeyboardEvent) => {
	// 	if (e.key === "w") {
	// 		// Déplacez la raquette gauche vers le haut (w pour joueur 1)
	// 		if (userPaddleRef.current)
	// 			movePaddles(userPaddleRef.current, "up");
	// 		webSocket.emit('movePaddle', {data : {direction : "up", roomId: roomId}});
	// 	}
	// 	else if (e.key === "s")
	// 	{
	// 		if (userPaddleRef.current)
	// 			movePaddles(userPaddleRef.current, "down");
	// 		webSocket.emit('movePaddle', {data : {direction : "down", roomId: roomId}});
	// 	}
	// };

	// useEffect(() => {
	// 	webSocket.on('matchEnded', () => {
	// 		setMatchEnded(true);
	// 		if (userScoreRef.current > opponentScoreRef.current && username && opponent)
	// 		{
	// 			MatchService.addMatch({
	// 				username: username,
	// 				opponent: opponent,
	// 				scoreUser: userScoreRef.current,
	// 				scoreOpponent: opponentScoreRef.current
	// 			});
	// 		}
	// 	});
	// 	return () => {
	// 		webSocket.off("matchEnded");
	// 	};
	// });



	// useEffect(() => {
	// 	// Écoutez les mises à jour du mouvement de la raquette de l'autre joueur
	// 	if (userPaddleRef.current == "" && opponentPaddleRef.current == "")
	// 		webSocket.emit('getPaddle', {data: {roomId: roomId}});

	// 	webSocket.on("sendPaddle", (data: { paddle: string }) => {
	// 		const paddle = data.paddle;

	// 		userPaddleRef.current = paddle;

	// 		if (data.paddle === "left")
	// 			opponentPaddleRef.current = "right";
	// 		else if (data.paddle === "right")
	// 			opponentPaddleRef.current = "left";
	// 	});

	// 	// Nettoyez les écouteurs webSocket lorsque le composant est démonté
	// 	return () => {
	// 	  webSocket.off("sendPaddle");
	// 	};
	// }, [webSocket, roomId, userPaddleRef, opponentPaddleRef]);

	// useEffect(() => {
	// 	// Écoutez les mises à jour du mouvement de la raquette de l'autre joueur
	// 	webSocket.on("opponentMovePaddle", (data: { direction: string }) => {
	// 		// Mettez à jour la position de la raquette de l'autre joueur
	// 		if (data.direction === "up") {
	// 			if (opponentPaddleRef.current)
	// 				movePaddles(opponentPaddleRef.current, "up");
	// 		} else if (data.direction === "down") {
	// 			if (opponentPaddleRef.current)
	// 				movePaddles(opponentPaddleRef.current, "down");
	// 		}
	// 	});

	// 	// Nettoyez les écouteurs webSocket lorsque le composant est démonté
	// 	return () => {
	// 	  webSocket.off("opponentMovePaddle");
	// 	};
	// }, []);

	// useEffect(() => {
	// 	const canvas = canvasRef.current;

	// 	if (!canvas) return;

	// 	const ctx = canvas.getContext("2d");
	// 	if (!ctx) return;

	// 	const update = () => {
	// 		const fieldWidth = canvas.width;
	// 		const fieldHeight = canvas.height;
	// 		const ballX = ballXRef.current;
	// 		const ballY = ballYRef.current;
	// 		const ballSpeedX = ballSpeedXRef.current;
	// 		const ballSpeedY = ballSpeedYRef.current;
	// 		const leftPaddleY = leftPaddleYRef.current;
	// 		const rightPaddleY = rightPaddleYRef.current;

	// 		// Mettez à jour les valeurs de position de la balle ici
	// 		let newBallX = ballX + ballSpeedX; // Déplacez la balle horizontalement
	// 		let newBallY = ballY + ballSpeedY; // Déplacez la balle verticalement

	// 		// Vérification de la collision avec un but
	// 		if (newBallX + gameSettings.radius > fieldWidth)
	// 		{
	// 			// Inverser la direction horizontale en cas de collision avec les bords
	// 			ballSpeedXRef.current = -ballSpeedX;
	// 			newBallX = fieldWidth / 2;
	// 			newBallY = fieldHeight / 2;

	// 			let randomAngle = Math.random();

	// 			if (randomAngle < 0.5)
	// 				randomAngle = 22.5 + Math.random() * 45;
	// 			else
	// 				randomAngle = 292.5 + Math.random() * 45;

	// 			// Convertir l'angle en radians
	// 			const radians = (45 * Math.PI) / 180;

	// 			// Calculer les composantes X et Y en utilisant des fonctions trigonométriques
	// 			ballSpeedXRef.current = ballSpeed * Math.cos(radians);
	// 			ballSpeedYRef.current = ballSpeed * Math.sin(radians);
	// 			// Augmentez le score du joueur droit lorsque la balle touche le bord droit

	// 			leftPaddleYRef.current = fieldHeight / 2 - paddleHeight / 2;
	// 			rightPaddleYRef.current = fieldHeight / 2 - paddleHeight / 2;
	// 			if (userPaddleRef.current === "left")
	// 			{
	// 				userScoreRef.current += 1;
	// 				if (userScoreRef.current == scoreMax)
	// 					webSocket.emit('endMatch', {data: {roomId: roomId, score: userScoreRef.current}});
	// 			}
	// 			else
	// 			{
	// 				opponentScoreRef.current += 1;
	// 				if (opponentScoreRef.current == scoreMax)
	// 					webSocket.emit('endMatch', {data: {roomId: roomId, score: opponentScoreRef.current}});
	// 			}
	// 		}

	// 		if (newBallX - gameSettings.radius < 0) {
	// 			// Inverser la direction horizontale en cas de collision avec les bords
	// 			ballSpeedXRef.current = -ballSpeedX;
	// 			newBallX = fieldWidth / 2;
	// 			newBallY = fieldHeight / 2;

	// 			let randomAngle = Math.random();

	// 			if (randomAngle < 0.5)
	// 				randomAngle = 112.5 + Math.random() * 45;
	// 			else
	// 				randomAngle = 202.5 + Math.random() * 45;

	// 			// Convertir l'angle en radians
	// 			const radians = (45 * Math.PI) / 180;

	// 			// Calculer les composantes X et Y en utilisant des fonctions trigonométriques
	// 			ballSpeedXRef.current = ballSpeed * Math.cos(radians);
	// 			ballSpeedYRef.current = ballSpeed * Math.sin(radians);

	// 			leftPaddleYRef.current = fieldHeight / 2 - paddleHeight / 2;
	// 			rightPaddleYRef.current = fieldHeight / 2 - paddleHeight / 2;
	// 			// Augmentez le score du joueur droit lorsque la balle touche le bord gauche
	// 			if (userPaddleRef.current === "right")
	// 			{
	// 				userScoreRef.current += 1;
	// 				if (userScoreRef.current == scoreMax)
	// 					webSocket.emit('endMatch', {data: {roomId: roomId, score: userScoreRef.current}});
	// 			}
	// 			else
	// 			{
	// 				opponentScoreRef.current += 1;
	// 				if (opponentScoreRef.current == scoreMax)
	// 				webSocket.emit('endMatch', {data: {roomId: roomId, score: opponentScoreRef.current}});
	// 			}
	// 		}

	// 		// Vérifiez les collisions avec les bords verticaux
	// 		if (newBallY + gameSettings.radius > fieldHeight || newBallY - gameSettings.radius < 0) {
	// 			// Inverser la direction verticale en cas de collision avec les bords
	// 			ballSpeedYRef.current = -ballSpeedY;
	// 		}

	// 		// Vérifiez les collisions avec les raquettes
	// 		if (
	// 			newBallX - gameSettings.radius < paddleWidth + 10 &&	// Prend en compte le décalage des raquettes
	// 			newBallY + gameSettings.radius > leftPaddleY &&
	// 			newBallY - gameSettings.radius < leftPaddleY + paddleHeight
	// 		) {
	// 			// Collision avec la raquette gauche, inversez la direction horizontale
	// 			ballSpeedXRef.current = -ballSpeedX;
	// 		}

	// 		if (
	// 			newBallX + gameSettings.radius > fieldWidth - paddleWidth - 10 &&	// Prend en compte le décalage des raquettes
	// 			newBallY + gameSettings.radius > rightPaddleY &&
	// 			newBallY - gameSettings.radius < rightPaddleY + paddleHeight
	// 		) {
	// 			// Collision avec la raquette droite, inversez la direction horizontale
	// 			ballSpeedXRef.current = -ballSpeedX;
	// 		}

	// 		// Mettez à jour les valeurs de position de la balle
	// 		ballXRef.current = newBallX;
	// 		ballYRef.current = newBallY;

	// 		// Dessinez le terrain
	// 		ctx.clearRect(0, 0, fieldWidth, fieldHeight);
	// 		ctx.fillStyle = "black";
	// 		ctx.fillRect(0, 0, fieldWidth, fieldHeight);

	// 		ctx.globalAlpha = 0.2;
	// 		ctx.fillStyle = "white";
	// 		ctx.font = "200px Arial"
	// 		ctx.fillText("PONG", 110, fieldHeight / 2 + 50);
	// 		ctx.globalAlpha = 1;

	// 		// Dessinez la ligne verticale blanche pointillée au milieu du terrain
	// 		ctx.strokeStyle = "white";
	// 		ctx.setLineDash([5, 15]); // Motif de ligne pointillée
	// 		ctx.beginPath();
	// 		ctx.moveTo(fieldWidth / 2, 0);
	// 		ctx.lineTo(fieldWidth / 2, fieldHeight);
	// 		ctx.stroke();
	// 		ctx.setLineDash([]); // Réinitialisez le motif de ligne

	// 		// Dessinez les raquettes
	// 		ctx.fillStyle = gameSettings.color;
	// 		ctx.fillRect(paddleOffset, leftPaddleY, paddleWidth, paddleHeight);
	// 		ctx.fillRect(fieldWidth - paddleWidth - paddleOffset, rightPaddleY, paddleWidth, paddleHeight);

	// 		// Dessinez la balle
	// 		ctx.fillStyle = "white";
	// 		ctx.beginPath();
	// 		ctx.arc(ballX, ballY, gameSettings.radius, 0, 2 * Math.PI);
	// 		ctx.fill();

	// 		// Dessinez les scores sur le canvas
	// 		ctx.font = "50px Arial";
	// 		if (userPaddleRef.current === "left")
	// 		{
	// 			ctx.fillText(`${userScoreRef.current}`, fieldWidth / 2 - 50, 50);
	// 			ctx.fillText(`${opponentScoreRef.current}`, fieldWidth / 2 + 20, 50);
	// 		}
	// 		else if (userPaddleRef.current === "right")
	// 		{
	// 			ctx.fillText(`${opponentScoreRef.current}`, fieldWidth / 2 - 50, 50);
	// 			ctx.fillText(`${userScoreRef.current}`, fieldWidth / 2 + 20, 50);
	// 		}
	// 		// Appelez la fonction update à la prochaine trame d'animation
	// 		requestAnimationFrame(update);
	// 	};

	// // Commencez la boucle d'animation
	// requestAnimationFrame(update);

	// // Écoutez les touches de contrôle des raquettes
	// window.addEventListener("keydown", moveUser);

	// 	// Nettoyez les événements lorsque le composant est démonté
	// 	return () => {
	// 		window.removeEventListener("keydown", moveUser);
	// 		};
	// }, []);

	useEffect(() => {
		const canvas = canvasRef.current;

		if (!canvas)
			return;

		const ctx = canvas.getContext("2d");
		if (!ctx)
			return;

		const update = () => {
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
			ctx.fillStyle = gameSettings.color;
			ctx.fillRect(paddleOffset, leftPaddleY, paddleWidth, paddleHeight);
			ctx.fillRect(fieldWidth - paddleWidth - paddleOffset, rightPaddleY, paddleWidth, paddleHeight);

			// Dessinez la balle
			ctx.fillStyle = "white";
			ctx.beginPath();
			ctx.arc(ballX, ballY, gameSettings.radius, 0, 2 * Math.PI);
			ctx.fill();

			// Dessinez les scores sur le canvas
			ctx.font = "50px Arial";
			// if (userPaddleRef.current === "left")
			// {
				ctx.fillText(`${userScoreRef.current}`, fieldWidth / 2 - 50, 50);
				ctx.fillText(`${opponentScoreRef.current}`, fieldWidth / 2 + 20, 50);
			// }
			// else if (userPaddleRef.current === "right")
			// {
				// ctx.fillText(`${opponentScoreRef.current}`, fieldWidth / 2 - 50, 50);
				// ctx.fillText(`${userScoreRef.current}`, fieldWidth / 2 + 20, 50);
			// }
			// Appelez la fonction update à la prochaine trame d'animation
			requestAnimationFrame(update);
		};

		requestAnimationFrame(update);
	}, []);

  useEffect(() => {
    webSocket.on('pongUpdate', (data: {ballX: number, ballY: number, leftPaddleY: number, rightPaddleY: number, userScore: number, opponentScore: number}) => {
		ballXRef.current = data.ballX;
		ballYRef.current = data.ballY;
		leftPaddleYRef.current = data.leftPaddleY;
		rightPaddleYRef.current = data.rightPaddleY;
		userScoreRef.current = data.userScore;
		opponentScoreRef.current = data.opponentScore;
	});

    // Clean up the socket connection when the component unmounts
    return () => {
      webSocket.off('pongUpdate');
    };
  }, []);

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
								<p className="text-4xl text-black font-bold">{userScoreRef.current}</p>
								<p className="text-4xl text-red-600 font-bold">-</p>
								<p className="text-4xl text-black font-bold">{opponentScoreRef.current}</p>
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
				<canvas ref={canvasRef} width={fieldWidth} height={fieldHeight} style={{ border: "2px solid white" }}></canvas>
			</div>
		</div>
		)
	);
};

export default PongLauncher;