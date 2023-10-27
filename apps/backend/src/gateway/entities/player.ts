import { StorageEngine } from "multer";
import { GameSettingsData } from "./gameSettingsData";

export class Player {
	id: string;
	username: string;
	score: number;
	paddleColor: string;
	gameSettings: GameSettingsData;

	constructor(id: string, username: string) {
	  this.id = id;
	  this.username = username;
	  this.score = -1;
	  this.gameSettings = new GameSettingsData(id, 0, 0, "", "");
	}

	setPaddleColor(color: string) { this.paddleColor = color; }

	setGameSettings(settings: GameSettingsData) { this.gameSettings = settings; }

	setScore(score: number) {
		this.score = score;
	}

	setUsername(username: string) {
		this.username = username;
	}

	setId(id: string) {
		this.id = id;
	}

}