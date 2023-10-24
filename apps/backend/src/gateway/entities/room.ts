// room.ts (ou room.model.ts)

export class Room {
	id: string;
	players: Set<string> = new Set();
	gameState: GameState;
	gameSettings: GameSettingsData[] = [];

	leftPaddle: string;
	rightPaddle: string;

	constructor(id: string) {
		this.id = id;
		this.gameState = GameState.Waiting;
	}

	setGameState(newState: GameState) {
		this.gameState = newState;
	}

	setLeftPaddle(client_id: string) { this.leftPaddle = client_id; }
	setRightPaddle(client_id: string) { this.rightPaddle = client_id; }
	addGameSettings(settings: GameSettingsData) {
		this.gameSettings.push(settings);
	}
}

export enum GameState {
	Waiting = 'waiting',
	inGame = 'inGame',
	// Autres états du jeu Pong
}

export class GameSettingsData {
	ballSpeed: number;
	radius: number;
	color: string;

	constructor(ballSpeed: number, radius: number, color: string) {
	  this.ballSpeed = ballSpeed;
	  this.radius = radius;
	  this.color = color;
	}
}