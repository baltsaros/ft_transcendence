// src/pages/GamePage.tsx
import React, { useRef, useEffect } from "react";
import Ball from "../components/pong/Ball";

const GamePage: React.FC = () => {

	const canvasRef = useRef<HTMLCanvasElement>(null);

	const canvas = canvasRef.current;
	if (!canvas) return;
	const ctx = canvas!.getContext("2d");
	if (!ctx) return;

	return (
		<div className="game-container">
			<h1>Welcome to the Game!</h1>
			<div className="flex justify-center items-center h-screen">
				<Ball x={40} y={40} radius={20} ctx={ctx} />
			</div>
		</div>
	);
};

export default GamePage;
