// src/components/Field.tsx
import React, { useRef, useEffect } from "react";
import Ball from './Ball';
import Paddle from './Paddle';
import Score from './Score';

const Field: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Dimensions du terrain
    const width = canvas.width;
    const height = canvas.height;

    // Dessiner le terrain noir
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);

    // Dessiner la bordure blanche
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, width, height);

    // Dessiner la ligne pointillée au milieu
    const segmentLength = 10;
    const segmentGap = 5;
    ctx.fillStyle = "white";
    for (let y = 0; y < height; y += segmentLength + segmentGap) {
      ctx.fillRect(width / 2 - 1, y, 2, segmentLength);
    }

    // Ajout pour dessiner Ball, Paddle, et Score:
    Ball.draw(ctx, width / 2, height / 2);
	Paddle.draw(ctx, 10, height / 2, "left");
	Paddle.draw(ctx, width - 10, height / 2, "right");
	Score.draw(ctx, width / 2, 50, 0, 0);
    // Paddle.draw(ctx, 'left'); // exemple pour dessiner le paddle gauche
    // Paddle.draw(ctx, 'right'); // exemple pour dessiner le paddle droit
    // Score.draw(ctx, 0, 0); // scores initiaux de 0-0

  }, []);

  return <canvas ref={canvasRef} width="900" height="500" />;
};

export default Field;
