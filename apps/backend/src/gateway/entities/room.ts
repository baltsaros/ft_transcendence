// room.ts (ou room.model.ts)

import { Ball } from "./ball";
import { GameSettingsData } from "./gameSettingsData";
import { Paddle } from "./paddle";
import { Player } from "./player";

export class Room {
	id: string;
	player1: Player;
	player2: Player;
	gameState: GameState;
	leftPaddle: Paddle;
	rightPaddle: Paddle;
	fieldWidth: number;
	fieldHeight: number;
	ball: Ball;
	ballSpeed: number;
	scoreMax: number;
	counter: number;

	constructor(id: string, player1: Player, player2: Player) {
		this.player1 = new Player(player1.id, player1.username);
		this.player2 = new Player(player2.id, player2.username);
		this.fieldHeight = 600;
		this.fieldWidth = 800;
		this.leftPaddle = new Paddle(player1, 5, this.fieldHeight / 2, 100, 10);
		this.rightPaddle = new Paddle(player2, this.fieldWidth - 10 - 5, this.fieldHeight / 2, 100, 10);
		this.id = id;
		this.gameState = GameState.Starting;
		this.ball = new Ball();
		this.ballSpeed = 0;
		this.scoreMax = 5;
		this.counter = 0;
	}

	incrementCounter() { this.counter++; }

	resetCounter() { this.counter = 0; }

	setBallSpeed(speed: number) { this.ballSpeed = speed; }

	setGameState(newState: GameState) {
		this.gameState = newState;
	}

	// Méthode pour obtenir un joueur par son id
	getPlayerById(id: string): Player | undefined {
		if (this.player1.id == id)
			return (this.player1);
		else if (this.player2.id == id)
			return (this.player2);
		else
			return (null);
	}

	getUsernameById( id:string ) : string | null{
		if (this.player1.id == id)
			return (this.player1.username);
		else if (this.player2.id == id)
			return (this.player2.username);
		else
			return (null);
	}

}

export enum GameState {
	Playing = 'playing',
	Ended = 'ended',
	Starting = 'starting'
	// Autres états du jeu Pong
}

export { GameSettingsData };

