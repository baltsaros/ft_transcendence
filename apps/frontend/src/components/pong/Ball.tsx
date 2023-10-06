import { useState } from "react";
import { IBallProps } from "../../types/types";

function Ball (ballProps: IBallProps)
{
	// state
	const [x, setX] = useState(ballProps.x);
	const [y, setY] = useState(ballProps.y);
	const [radius, setRadius] = useState(ballProps.radius);
	const [ctx, setCtx] = useState(ballProps.ctx);

	// behavior
	const draw = () => {
		// Dessiner la balle sur le canvas en utilisant le contexte de rendu
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, 2 * Math.PI);
		ctx.fillStyle = 'white';
		ctx.fill();
		ctx.closePath();
	  };

	// render
	return (
	<div>
		draw();
	</div>
	);

}

export default Ball;