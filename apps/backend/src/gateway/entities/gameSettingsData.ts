export class GameSettingsData {
	ballSpeed: number;
	radius: number;
	userPaddlecolor: string;
	opponentPaddleColor: string;
	user: string;



	constructor (id: string, ballSpeed: number, radius: number, userPaddleColor: string, opponentPaddleColor: string)
	{
		this.user = id;
		this.user = "";
		this.ballSpeed = ballSpeed;
		this.radius = radius;
		this.userPaddlecolor = userPaddleColor;
		this.opponentPaddleColor = opponentPaddleColor;
	}
}