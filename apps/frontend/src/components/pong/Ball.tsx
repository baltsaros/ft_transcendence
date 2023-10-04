import React from 'react';

interface BallProps {
    initialX: number; // position x initiale
    initialY: number; // position y initiale
    directionX: number; // direction x (-1 pour gauche, 1 pour droite)
    directionY: number; // direction y (-1 pour haut, 1 pour bas)
    speed: number; // vitesse de la balle
}

const Ball: React.FC<BallProps> & {
    RADIUS: number;
    draw: (ctx: CanvasRenderingContext2D, x: number, y: number) => void;
    move: (x: number, y: number, directionX: number, directionY: number, speed: number) => void;
} = ({ initialX, initialY, directionX, directionY, speed }) => {
    const [x, setX] = React.useState(initialX); // Utilisation de l'état local pour gérer la position actuelle
    const [y, setY] = React.useState(initialY);

    // Fonction pour réinitialiser la position de la balle à sa position de départ
    const reset = () => {
        setX(initialX);
        setY(initialY);
    };

    return <div className="bg-white rounded-full w-8 h-8"></div>;
}

Ball.RADIUS = 7.5;

Ball.draw = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.beginPath();
    ctx.arc(x, y, Ball.RADIUS, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
}

// Fonction pour déplacer la balle
Ball.move = (x, y, directionX, directionY, speed) => {
    // Calculer la nouvelle position en fonction de la direction et de la vitesse
    const newX = x + directionX * speed;
    const newY = y + directionY * speed;
    // Mettre à jour la position
    // Note : dans une application réelle, vous pourriez également vérifier les collisions ici
    // et ajuster la direction en conséquence
    return { x: newX, y: newY };
}

export default Ball;
