export class Ball {
	x: number;
	y: number;
	speedX: number;
	speedY: number;
	radius: number;

	constructor(x: number, radius: number, y: number, speedX: number, speedY: number) {
	  this.x = x;
	  this.y = y;
	  this.radius = radius;
	  this.speedX = speedX;
	  this.speedY = speedY;
	}

	setPosition(x: number, y: number)
	{
		this.x = x;
		this.y = y;
	}

	setSpeed(speedX: number, speedY: number)
	{
		this.speedX = speedX;
		this.speedY = speedY;
	}

	setRadius(radius: number)
	{
		this.radius = radius;
	}
}
