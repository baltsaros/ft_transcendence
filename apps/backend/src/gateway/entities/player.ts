import { StorageEngine } from "multer";

export class Player {
	id: string;
	username: string;
	score: number;

	constructor(id: string, username: string) {
	  this.id = id;
	  this.username = username;
	  this.score = -1;
	}

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