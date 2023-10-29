import { Player } from "./player";

export class Paddle {
	x: number;
	y: number;
	speed: number;
	height: number;
	width: number;
	player: Player;
	color: string;

	constructor(player: Player, x: number, y: number, height: number, width: number, speed: number) {
	  this.x = x;
	  this.y = y;
	  this.speed = speed;
	  this.height = height;
	  this.width = width;
	  this.color = "white";
	  this.player = new Player(player.id, player.username);
	}

	setColor(color: string) { this.color = color; }

	setPosition(y: number) {
		this.y = y;
	}

	setPlayer(player: Player)
	{
		this.player = player;
	}
}
