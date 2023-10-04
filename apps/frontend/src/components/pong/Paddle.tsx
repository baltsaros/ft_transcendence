import React from 'react';

interface PaddleProps {}

const Paddle: React.FC<PaddleProps> & {
    draw: (ctx: CanvasRenderingContext2D, x: number, y: number, side: 'left' | 'right') => void;
} = () => {
    return (
        <div className="bg-white w-4 h-24"></div>
    );
}

// Méthode statique pour dessiner le paddle sur un canvas
Paddle.draw = (ctx: CanvasRenderingContext2D, x: number, y: number, side: 'left' | 'right') => {
    const paddleWidth = 5;
    const paddleHeight = 50;

    ctx.fillStyle = "white";

    if (side === 'left') {
        ctx.fillRect(x, y - paddleHeight / 2, paddleWidth, paddleHeight);
    } else { // side === 'right'
        ctx.fillRect(x - paddleWidth, y - paddleHeight / 2, paddleWidth, paddleHeight);
    }
};

export default Paddle;
