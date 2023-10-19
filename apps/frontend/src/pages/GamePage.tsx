import Cookies from "js-cookie";
import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Socket, io } from "socket.io-client";
import WaitingGame from "../components/WaitingGame";
import GameSettings from "./GameSettings";


const colors = ["white", "teal", "yellow", "orange", "red", "green", "purple"];
const fieldWidth = 800;
const fieldHeight = 600;
const paddleWidth = 10;
const paddleHeight = 100;
const paddleOffset = 3;
const leftPaddleX = paddleOffset;
const rightPaddleX = fieldWidth - paddleWidth - paddleOffset;
const paddleSpeed = 20;
const ballSpeed = 6;

const GamePage: React.FC = () => {

	const webSocketRef = useRef<Socket | null>(null);
	const [modalView, setModalView] = useState<boolean>(false);
	const [showGameSettings, setShowGameSettings] = useState(false);

	const handleOpenModal = () => {
		// Ouvrez le modal en passant la socket WebSocket en tant que prop
		if (!webSocketRef.current) {
		  webSocketRef.current = io('ws://localhost:3000/pong', {
			query: {
			  username: Cookies.get('username'),
			},
		  });
		}
		setModalView(true);
	  };

	  const handleCloseModal = () => {
		// Fermez le modal
		webSocketRef.current?.close();
		webSocketRef.current = null;
		setModalView(false);
	  };

	//check if radius is good.
	const {radius="10"} = useParams();
	let radiusNumber = 10;
	if (!(isNaN(parseInt(radius)) || parseInt(radius) < 3 || parseInt(radius) > 20)) {
		radiusNumber = parseInt(radius);
	}

	//check if speed is good.
	const {ballSpeed = "7"} = useParams();
	let ballSpeedNumber = 7;
	if (!(isNaN(parseInt(ballSpeed)) || parseInt(ballSpeed) < 3 || parseInt(ballSpeed) > 20)) {
		ballSpeedNumber = parseInt(ballSpeed);
	}

	//Check for good color.
	let {color = "white"} = useParams();
	if (!colors.includes(color))
		color = "white";

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const ballXRef = useRef(fieldWidth / 2);
	const ballYRef = useRef(fieldHeight / 2);
	const ballSpeedXRef = useRef(ballSpeedNumber);
	const ballSpeedYRef = useRef(ballSpeedNumber);
	const leftPaddleYRef = useRef(fieldHeight / 2 - paddleHeight / 2);
	const rightPaddleYRef = useRef(fieldHeight / 2 - paddleHeight / 2);
	const player1ScoreRef = useRef(0);
	const player2ScoreRef = useRef(0);

	const movePaddles = (e: KeyboardEvent) => {
		// Déplacez les raquettes en fonction des touches de contrôle
		if (e.key === "o") {
			// Déplacez la raquette droite vers le haut
			rightPaddleYRef.current = Math.max(0, rightPaddleYRef.current - paddleSpeed);
		} else if (e.key === "l") {
			// Déplacez la raquette droite vers le bas
			rightPaddleYRef.current = Math.min(
				fieldHeight - paddleHeight,
				rightPaddleYRef.current + paddleSpeed
			);
		} else if (e.key === "w") {
			// Déplacez la raquette gauche vers le haut (w pour joueur 1)
			leftPaddleYRef.current = Math.max(0, leftPaddleYRef.current - paddleSpeed);
		} else if (e.key === "s") {
			// Déplacez la raquette gauche vers le bas (s pour joueur 1)
			leftPaddleYRef.current = Math.min(
				fieldHeight - paddleHeight,
				leftPaddleYRef.current + paddleSpeed
			);
		}
	};

	useEffect(() => {
		handleOpenModal();

		webSocketRef.current?.on('matchmakingSuccess', (data: { roomId: string }) => {
			console.log(`Matchmaking successful. Room ID: ${data.roomId}`);
			setModalView(false); // Fermez le composant WaitingGame
			setShowGameSettings(true); // Affichez le composant GameSettings
		  });

		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const update = () => {
			const fieldWidth = canvas.width;
			const fieldHeight = canvas.height;
			const ballX = ballXRef.current;
			const ballY = ballYRef.current;
			const ballSpeedX = ballSpeedXRef.current;
			const ballSpeedY = ballSpeedYRef.current;
			const leftPaddleY = leftPaddleYRef.current;
			const rightPaddleY = rightPaddleYRef.current;

			// Mettez à jour les valeurs de position de la balle ici
			let newBallX = ballX + ballSpeedX; // Déplacez la balle horizontalement
			let newBallY = ballY + ballSpeedY; // Déplacez la balle verticalement

			// Vérification des bords verticaux
			if (newBallX + radiusNumber > fieldWidth)
			{
				// Inverser la direction horizontale en cas de collision avec les bords
				ballSpeedXRef.current = -ballSpeedX;
				newBallX = fieldWidth / 2;
				newBallY = fieldHeight / 2;

				let randomAngle = Math.random();

				if (randomAngle < 0.5)
					randomAngle = 22.5 + Math.random() * 45;
				else
					randomAngle = 292.5 + Math.random() * 45;

				// Convertir l'angle en radians
				const radians = (randomAngle * Math.PI) / 180;

				// Calculer les composantes X et Y en utilisant des fonctions trigonométriques
				ballSpeedXRef.current = ballSpeedNumber * Math.cos(radians);
				ballSpeedYRef.current = ballSpeedNumber * Math.sin(radians);

				// Augmentez le score du joueur 1 lorsque la balle touche le bord droit
				player1ScoreRef.current += 1;
			}

			if (newBallX - radiusNumber < 0) {
				// Inverser la direction horizontale en cas de collision avec les bords
				ballSpeedXRef.current = -ballSpeedX;
				newBallX = fieldWidth / 2;
				newBallY = fieldHeight / 2;

				let randomAngle = Math.random();

				if (randomAngle < 0.5)
					randomAngle = 112.5 + Math.random() * 45;
				else
					randomAngle = 202.5 + Math.random() * 45;

				// Convertir l'angle en radians
				const radians = (randomAngle * Math.PI) / 180;

				// Calculer les composantes X et Y en utilisant des fonctions trigonométriques
				ballSpeedXRef.current = ballSpeedNumber * Math.cos(radians);
				ballSpeedYRef.current = ballSpeedNumber * Math.sin(radians);

				// Augmentez le score du joueur 2 lorsque la balle touche le bord gauche
				player2ScoreRef.current += 1;
			}

			// Vérifiez les collisions avec les bords verticaux
			if (newBallY + radiusNumber > fieldHeight || newBallY - radiusNumber < 0) {
				// Inverser la direction verticale en cas de collision avec les bords
				ballSpeedYRef.current = -ballSpeedY;
			}

			// Vérifiez les collisions avec les raquettes
			if (
				newBallX - radiusNumber < paddleWidth + 10 &&  // Prend en compte le décalage des raquettes
				newBallY + radiusNumber > leftPaddleY &&
				newBallY - radiusNumber < leftPaddleY + paddleHeight
			) {
				// Collision avec la raquette gauche, inversez la direction horizontale
				ballSpeedXRef.current = -ballSpeedX;
			}

			if (
				newBallX + radiusNumber > fieldWidth - paddleWidth - 10 &&  // Prend en compte le décalage des raquettes
				newBallY + radiusNumber > rightPaddleY &&
				newBallY - radiusNumber < rightPaddleY + paddleHeight
			) {
				// Collision avec la raquette droite, inversez la direction horizontale
				ballSpeedXRef.current = -ballSpeedX;
			}

			// Mettez à jour les valeurs de position de la balle
			ballXRef.current = newBallX;
			ballYRef.current = newBallY;

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
			ctx.fillStyle = color;
			ctx.fillRect(10, leftPaddleY, paddleWidth, paddleHeight);
			ctx.fillRect(fieldWidth - paddleWidth - 10, rightPaddleY, paddleWidth, paddleHeight);

			// Dessinez la balle
			ctx.fillStyle = "white";
			ctx.beginPath();
			ctx.arc(ballX, ballY, radiusNumber, 0, 2 * Math.PI);
			ctx.fill();

			// Dessinez les scores sur le canvas
			ctx.font = "50px Arial";
			ctx.fillText(`${player1ScoreRef.current}`, fieldWidth / 2 - 50, 50);
			ctx.fillText(`${player2ScoreRef.current}`, fieldWidth / 2 + 20, 50);

			// Appelez la fonction update à la prochaine trame d'animation
			requestAnimationFrame(update);
		};

		// Commencez la boucle d'animation
		requestAnimationFrame(update);

		// Écoutez les touches de contrôle des raquettes
		window.addEventListener("keydown", movePaddles);

		// Nettoyez les événements lorsque le composant est démonté
		return () => {
			window.removeEventListener("keydown", movePaddles);
		};
	}, []);

	return (

		<div className="game-container">
			{modalView && webSocketRef.current && !showGameSettings && (<WaitingGame onClose={handleCloseModal} webSocket={webSocketRef.current} />)}
			{showGameSettings && ( <GameSettings /> )}
			{/* <div className="flex justify-center items-center h-screen">`
				<canvas
					ref={canvasRef}
					width={fieldWidth}
					height={fieldHeight}
					style={{ border: "2px solid white" }}
				></canvas>
			</div> */}
		</div>
	);
};

export default GamePage;
