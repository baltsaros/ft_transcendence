// room.ts (ou room.model.ts)

export class Room {
	id: string;
	players: Set<string> = new Set();
	gameState: GameState;
	gameSettings: GameSettingsData[] = [];
	player1: {username: string, score: number};
	player2: {username: string, score: number};
	leftPaddle: string;
	rightPaddle: string;

	constructor(id: string) {
		this.id = id;
		this.gameState = GameState.Waiting;
	}

	setGameState(newState: GameState) {
		this.gameState = newState;
	}

	setPlayer1Score(score: number) {this.player1.score = score};
	setPlayer2Score(score: number) {this.player1.score = score};
	setPlayer1Username(username: string) {this.player1.username = username};
	setPlayer2Username(username: string) {this.player2.username = username};
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

export class Player {
	username: string;
	id: string;

	constructor(username: string, id: string) {
		this.username = username;
		this.id = id;
	}
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