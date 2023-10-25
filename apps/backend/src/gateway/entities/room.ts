// room.ts (ou room.model.ts)

import { Player } from "./player";

export class Room {
	id: string;
	players: Map<string, Player> = new Map();
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

	// Méthode pour ajouter un joueur à la salle
	addPlayer(player: Player) {
		this.players.set(player.id, player);
	}

	// Méthode pour définir le paddle gauche
	setLeftPaddle(client_id: string) {
		this.leftPaddle = client_id;
	}

	// Méthode pour définir le paddle droit
	setRightPaddle(client_id: string) {
		this.rightPaddle = client_id;
	}

	// Méthode pour obtenir un joueur par son id
	getPlayerById(id: string): Player | undefined {
		return this.players.get(id);
	}

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