// src/components/Game.js
import { useState, useEffect } from 'react';
import Paddle from './Paddle';
import Ball from './Ball';

const Game = () => {
  const [paddle1Y, setPaddle1Y] = useState(250);
  const [paddle2Y, setPaddle2Y] = useState(250);
  const [ballX, setBallX] = useState(392.5);
  const [ballY, setBallY] = useState(292.5);
  const [ballSpeedX, setBallSpeedX] = useState(0);
  const [ballSpeedY, setBallSpeedY] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'w') {
        setPaddle1Y((prevY) => Math.max(prevY - 10, 0));
      } else if (event.key === 's') {
        setPaddle1Y((prevY) => Math.min(prevY + 10, 600 - 110));
      }

      if (event.key === 'o') {
        setPaddle2Y((prevY) => Math.max(prevY - 10, 0));
      } else if (event.key === 'l') {
        setPaddle2Y((prevY) => Math.min(prevY + 10, 600 - 110));
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
		  // Mise à jour des positions des raquettes et de la balle
		  setBallX((prevX) => prevX + ballSpeedX * 3);
		  setBallY((prevY) => prevY + ballSpeedY * 3);

		  // Gestion des collisions avec les bords verticaux
		  if (ballY <= 20 || ballY >= 600 - 20) {
			setBallSpeed((prevSpeed) => -prevSpeed);
		  }

		//   // Gestion des collisions avec les murs horizontaux (points marqués)
		//   if (ballX <= 5 || ballX >= 800 - 0) { // Note: Changed 10 to 15
		// 	// Réinitialiser la position de la balle au centre
		// 	setBallX(392.5); // 800 / 2 - 15 / 2
		// 	setBallY(292.5); // 600 / 2 - 15 / 2

		// 	// Réinitialiser la direction de la balle de manière aléatoire
		// 	const newSpeedX = Math.random() > 0.5 ? 1 : -1;
		// 	const newSpeedY = Math.random() > 0.5 ? 1 : -1;
		// 	setBallSpeedX(newSpeedX);
		// 	setBallSpeedY(newSpeedY);
		//   }
		}
    };

    const gameLoop = setInterval(updateGame, 16);

    return () => clearInterval(gameLoop);
  }, [gameStarted]);

  return (
    <div style={{ position: 'relative', width: '800px', height: '600px', backgroundColor: 'black', margin: '20px', border: '5px solid grey'}}>
      <Paddle x={10} y={paddle1Y} width={10} height={100} />
      <Paddle x={770} y={paddle2Y} width={10} height={100} />
      <Ball x={ballX} y={ballY} size={15} />
	{/* Ligne en pointillé sur la moitié du terrain */}
	<div style={{ position: 'absolute', width: '0', height: '100%', top: '0', left: '50.5%', borderLeft: 'dotted 2px white' }}/></div>
  );
};


export default Game;
