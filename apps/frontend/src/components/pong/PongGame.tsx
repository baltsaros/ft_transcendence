// src/components/Game.js
import { useState, useEffect } from 'react';
import Paddle from './Paddle';
import Ball from './Ball';

const Game = () => {
  const [paddle1Y, setPaddle1Y] = useState(250);
  const [paddle2Y, setPaddle2Y] = useState(250);
  const [ballX, setBallX] = useState(400);
  const [ballY, setBallY] = useState(300);
  const [ballSpeedX, setBallSpeedX] = useState(0);
  const [ballSpeedY, setBallSpeedY] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'w') {
        setPaddle1Y((prevY) => Math.max(prevY - 10, 0));
      } else if (event.key === 's') {
        setPaddle1Y((prevY) => Math.min(prevY + 10, 600 - 100));
      }

      if (event.key === 'o') {
        setPaddle2Y((prevY) => Math.max(prevY - 10, 0));
      } else if (event.key === 'l') {
        setPaddle2Y((prevY) => Math.min(prevY + 10, 600 - 100));
      }

      if (event.key === 'Enter' && !gameStarted) {
        startGame();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted]);

  const startGame = () => {
    // Lancer la balle avec une direction aléatoire
    const initialSpeedX = Math.random() > 0.5 ? 1 : -1;
    const initialSpeedY = Math.random() > 0.5 ? 1 : -1;

    setBallSpeedX(initialSpeedX);
    setBallSpeedY(initialSpeedY);
    setGameStarted(true);
  };

  useEffect(() => {
    const updateGame = () => {
      if (gameStarted) {
        // Mettez à jour les positions et la logique du jeu ici
        // Par exemple, mettre à jour la position de la balle en fonction de ballSpeedX et ballSpeedY
      }
    };

    const gameLoop = setInterval(updateGame, 16);

    return () => clearInterval(gameLoop);
  }, [gameStarted]);

  return (
    <div style={{ position: 'relative', width: '800px', height: '600px', backgroundColor: 'black' }}>
      <Paddle x={0} y={paddle1Y} width={10} height={100} />
      <Paddle x={790} y={paddle2Y} width={10} height={100} />
      <Ball x={ballX} y={ballY} size={10} />
    </div>
  );
};

export default Game;
