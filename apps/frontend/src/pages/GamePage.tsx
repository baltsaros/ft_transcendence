// src/pages/GamePage.tsx
import React from "react";
import Field from "../components/pong/Field";

const GamePage: React.FC = () => {
	return (
		<div className="game-container">
			<h1>Welcome to the Game!</h1>
			<div className="flex justify-center items-center h-screen">
				<Field />
			</div>
		</div>
	);
};

export default GamePage;
