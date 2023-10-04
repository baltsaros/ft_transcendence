import React from 'react';

interface ScoreProps {
    player1: number;
    player2: number;
}

const Score: React.FC<ScoreProps> & {
    draw: (ctx: CanvasRenderingContext2D, x: number, y: number, player1: number, player2: number) => void;
} = ({ player1, player2 }) => {
    return (
        <div className="flex items-center justify-center space-x-4">
            <span className="text-white text-2xl">{player1}</span>
            <span className="text-white text-xl">-</span>
            <span className="text-white text-2xl">{player2}</span>
        </div>
    );
}

// Méthode statique pour dessiner le score sur un canvas
Score.draw = (ctx: CanvasRenderingContext2D, x: number, y: number, player1: number, player2: number) => {
    ctx.font = "2em Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(`${player1} - ${player2}`, x, y);
};

export default Score;
