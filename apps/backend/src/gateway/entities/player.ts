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
	  this.score = 0;
	  this.gameSettings = new GameSettingsData(id, 0, 0, "", "");
	  this.paddleColor = "";
	}

	setPaddleColor(color: string) { this.paddleColor = color; }

	setGameSettings(settings: GameSettingsData) { this.gameSettings = settings; }

	scoreGoal() {
		this.score++;
	}

	setUsername(username: string) {
		this.username = username;
	}

	resetPlayer() {
		this.id = "";
		this.username = "";
		this.score = 0;
		this.gameSettings = new GameSettingsData("", 0, 0, "", "");
		this.paddleColor = "";
	}

	setId(id: string) {
		this.id = id;
	}

}