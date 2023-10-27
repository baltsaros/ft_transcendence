import { Player } from "./player";

export class Paddle {
	x: number;
	y: number;
	speed: number;
	height: number;
	width: number;
	player: Player;
	color: string;

	constructor(player: Player, y: number, height: number, width: number) {
	  this.x = 0;
	  this.y = y;
	  this.speed = 0;
	  this.height = height;
	  this.width = width;
	  this.color = "white";
	  this.player = new Player(player.id, player.username);
	}

	setColor(color: string) { this.color = color; }

	setPosition(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	setPlayer(player: Player)
	{
		this.player = player;
	}
}
