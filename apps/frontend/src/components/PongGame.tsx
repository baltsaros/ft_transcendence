// PongGame.js

import { useState, useEffect, useRef } from 'react';

const PongGame = () => {
	const canvasRef = useRef(null);
	const [ballPosition, setBallPosition] = useState({ x: 400, y: 300 });
	const [ballVelocity, setBallVelocity] = useState({ x: 0, y: 0 });
	const [player1Position, setPlayer1Position] = useState(250);
	const [player2Position, setPlayer2Position] = useState(250);
	const [player1Score, setPlayer1Score] = useState(0);
	const [player2Score, setPlayer2Score] = useState(0);
	const [gameStarted, setGameStarted] = useState(false);

	useEffect(() => {
	  const canvas = canvasRef.current;
	  const context = canvas.getContext('2d');

	  const gameLoop = () => {
		context.clearRect(0, 0, canvas.width, canvas.height);

		context.fillRect(10, player1Position, 10, 100);
		context.fillRect(canvas.width - 20, player2Position, 10, 100);

		context.beginPath();
		context.arc(ballPosition.x, ballPosition.y, 10, 0, Math.PI * 2);
		context.fillStyle = 'blue';
		context.fill();
		context.closePath();

		// if (gameStarted) {
		//   setBallPosition(prevBallPosition => ({
		// 	x: prevBallPosition.x + ballVelocity.x,
		// 	y: prevBallPosition.y + ballVelocity.y,
		//   }));
		// }

		// if (!gameStarted) {
		//   if (Math.random() < 0.5) {
		// 	setBallVelocity({ x: 2, y: 1 });
		//   } else {
		// 	setBallVelocity({ x: -2, y: -1 });
		//   }
		// }

    //   // Gestion des collisions et des scores
    //   if (ballPosition.x + 10 > canvas.width) {
    //     // Collision avec le bord droit (player 1 a marqué un point)
    //     setPlayer1Score(prevScore => prevScore + 1);
    //     resetBall();
    //   }
    //   if (ballPosition.x - 10 < 0) {
    //     // Collision avec le bord gauche (player 2 a marqué un point)
    //     setPlayer2Score(prevScore => prevScore + 1);
    //     resetBall();
    //   }
    //   if (
    //     (ballPosition.x - 10 < 20 && ballPosition.y > player1Position && ballPosition.y < player1Position + 100) ||
    //     (ballPosition.x + 10 > canvas.width - 20 && ballPosition.y > player2Position && ballPosition.y < player2Position + 100)
    //   ) {
    //     // Collision avec les raquettes (rebond de la balle)
    //     setBallPosition(prevBallPosition => ({
    //       x: prevBallPosition.x,
    //       y: prevBallPosition.y,
    //     }));
    //   }

      // Appel de gameLoop pour la prochaine frame

      requestAnimationFrame(gameLoop);
    };

    const interval = setInterval(gameLoop, 16);

    return () => {
      clearInterval(interval);
    };
  }, [ballPosition, ballVelocity, player1Position, player2Position, gameStarted]);

  const handleKeyDown = (event) => {
    if (event.key === ' ') { // Espace pour démarrer le jeu
      setGameStarted(true);
    }
    if (event.key === 'w') {
      setPlayer1Position(prevPosition => Math.max(0, prevPosition - 10));
    }
    if (event.key === 's') {
      setPlayer1Position(prevPosition =>
        Math.min(canvasRef.current.height - 100, prevPosition + 10)
      );
    }
    if (event.key === 'o') {
      setPlayer2Position(prevPosition => Math.max(0, prevPosition - 10));
    }
    if (event.key === 'l') {
      setPlayer2Position(prevPosition =>
        Math.min(canvasRef.current.height - 100, prevPosition + 10)
      );
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="pong-game-container">
      <div className="game-info">
        <div className="scores">{player1Score} - {player2Score}</div>
		{!gameStarted && <div className="start-message">Press 'space' to start...</div>}
      </div>
      <canvas ref={canvasRef} width={800} height={600} />
    </div>
  );
};
  export default PongGame;