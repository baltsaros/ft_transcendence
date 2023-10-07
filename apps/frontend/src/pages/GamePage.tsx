import React, { useRef, useEffect, useState } from "react";
import Ball from "../components/pong/Ball";

const fieldWidth = 800;
const fieldHeight = 600;
const radius = 50;
const speed = 10;

const GamePage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ballX, setBallX] = useState(fieldWidth / 2); // Position X de la balle
  const [ballY, setBallY] = useState(fieldHeight / 2); // Position Y de la balle
  const [ballSpeedX, setBallSpeedX] = useState(speed);
  const [ballSpeedY, setBallSpeedY] = useState(speed);

// Fonction pour mettre à jour la position de la balle
const updateBallPosition = () => {
    // Mettez à jour les valeurs de position de la balle ici
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Dimensions du terrain
    const fieldWidth = canvas.width;
    const fieldHeight = canvas.height;

    // Nouvelles positions de la balle
    let newBallX = ballX + ballSpeedX; // Déplacez la balle horizontalement
    let newBallY = ballY + ballSpeedY; // Déplacez la balle verticalement

    // Vérifiez les collisions avec les bords
    if (newBallX + radius > fieldWidth || newBallX - radius < 0) {
      // Inverser la direction horizontale en cas de collision avec les bords
      setBallSpeedX(-ballSpeedX);
    }

    if (newBallY + radius > fieldHeight || newBallY - radius < 0) {
      // Inverser la direction verticale en cas de collision avec les bords
      setBallSpeedY(-ballSpeedY);
    }

    // Mettez à jour les valeurs de position de la balle
    setBallX(newBallX);
    setBallY(newBallY);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fonction pour dessiner la balle
    const drawBall = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Effacez le canvas
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(ballX, ballY, radius, 0, 2 * Math.PI);
      ctx.fill();
    };

    // Mettez à jour la position de la balle à intervalles réguliers
    const intervalId = setInterval(updateBallPosition, 16); // Environ 60 FPS

    // Dessinez la balle initiale
    drawBall();

    // Nettoyez l'intervalle lorsque le composant est démonté
    return () => {
      clearInterval(intervalId);
    };
  }, [ballX, ballY]);

  return (
    <div className="game-container">
      <h1>Welcome to the Game!</h1>
      <div className="flex justify-center items-center h-screen">
        <canvas
          ref={canvasRef}
          width={fieldWidth}
          height={fieldHeight}
          style={{ border: "2px solid white" }}
        ></canvas>
      </div>
    </div>
  );
};

export default GamePage;
