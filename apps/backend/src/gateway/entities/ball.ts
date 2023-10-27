export class Ball {
	x: number;
	y: number;
	speedX: number;
	speedY: number;
	radius: number;

	constructor() {
	  this.x = 0;
	  this.y = 0;
	  this.radius = 0;
	  this.speedX = 0;
	  this.speedY = 0;
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
