import React, { useRef, useEffect } from "react";

const fieldWidth = 800;
const fieldHeight = 600;
const radius = 10;
const paddleWidth = 10;
const paddleHeight = 100;
const paddleSpeed = 20;
const ballSpeed = 7.5;

const GamePage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballXRef = useRef(fieldWidth / 2);
  const ballYRef = useRef(fieldHeight / 2);
  const ballSpeedXRef = useRef(ballSpeed);
  const ballSpeedYRef = useRef(ballSpeed);
  const leftPaddleYRef = useRef(fieldHeight / 2 - paddleHeight / 2);
  const rightPaddleYRef = useRef(fieldHeight / 2 - paddleHeight / 2);

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

      // Vérifiez les collisions avec les bords
      if (newBallX + radius > fieldWidth || newBallX - radius < 0) {
        // Inverser la direction horizontale en cas de collision avec les bords
        ballSpeedXRef.current = -ballSpeedX;
      }

      if (newBallY + radius > fieldHeight || newBallY - radius < 0) {
        // Inverser la direction verticale en cas de collision avec les bords
        ballSpeedYRef.current = -ballSpeedY;
      }

      // Vérifiez les collisions avec les raquettes
      if (
        newBallX - radius < paddleWidth &&
        newBallY + radius > leftPaddleY &&
        newBallY - radius < leftPaddleY + paddleHeight
      ) {
        // Collision avec la raquette gauche, inversez la direction horizontale
        ballSpeedXRef.current = -ballSpeedX;
      }

      if (
        newBallX + radius > fieldWidth - paddleWidth &&
        newBallY + radius > rightPaddleY &&
        newBallY - radius < rightPaddleY + paddleHeight
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

      // Dessinez la raquette gauche
      ctx.fillStyle = "white";
      ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);

      // Dessinez la raquette droite
      ctx.fillRect(fieldWidth - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);

      // Dessinez la balle
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(ballX, ballY, radius, 0, 2 * Math.PI);
      ctx.fill();

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
