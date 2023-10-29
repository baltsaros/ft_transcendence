export class Ball {
	x: number;
	y: number;
	speedX: number;
	speedY: number;
	radius: number;

	constructor() {
		this.speedX = 0;
		this.speedY = 0;
		this.x = 0;
		this.y = 0;
		this.radius = 0;
	}

	setRandomDirection(ballSpeed: number)
	{
		const random = Math.random() * 4;
		let angle: number;

		if (random < 1)
			angle = 22.5 + Math.random() * 45;
		else if (random < 2)
			angle = 112.5 + Math.random() * 45;
		else if (random < 3)
			angle = 202.5 + Math.random() * 45;
		else if (random < 4)
			angle = 292.5 + Math.random() * 45;

		const radians = (angle * Math.PI) / 180;

		this.speedX = ballSpeed * Math.cos(radians);
		this.speedY = ballSpeed * Math.sin(radians);
	}

	setPosition(x: number, y: number)
	{
		this.x = x;
		this.y = y;
	}

	increaseSpeed() {
		this.speedX *= 1.0005;
		console.log(this.speedX);
		this.speedY *= 1.0005;
	}

	setSpeedX(speedX: number)
	{
		this.speedX = speedX;
	}

	setSpeedY(speedY: number)
	{
		this.speedY = speedY;

	}

	setRadius(radius: number)
	{
		this.radius = radius;
	}
}
