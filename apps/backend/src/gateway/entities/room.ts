// room.ts (ou room.model.ts)

export class Room {
	id: string;
	players: Set<string> = new Set();
	gameState: GameState;

	constructor(id: string) {
		this.id = id;
		this.gameState = GameState.Waiting;
	}

	setGameState(newState: GameState) {
		this.gameState = newState;
	  }
}

export enum GameState {
	Waiting = 'waiting',
	inGame = 'inGame',
	// Autres états du jeu Pong
}