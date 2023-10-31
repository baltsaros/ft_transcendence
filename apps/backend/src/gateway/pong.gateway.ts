import {
	WebSocketGateway,
	SubscribeMessage,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
	ConnectedSocket,
	MessageBody
} from '@nestjs/websockets';
// import { instance } from "../../../frontend/src/api/axios.api";

import { Server, Socket } from 'socket.io';
import { Player } from './entities/player';
import { GameSettingsData, GameState, Room } from './entities/room';

  @WebSocketGateway({ namespace: '/pong', cors: { origin: '*' } })
  export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;

	private pongRooms: Map<string, Room> = new Map();
	// Liste d'attente des joueurs en attente de match
	private	waitingPlayers: Player[] = [];
	private	onlinePlayers: Player[] = [];

	handleConnection(client: Socket) {
		// console.log(`Client connected: ${client.id}`);
		// const username = Cookies.get('username');
		let username = client.handshake.query.username.toString();
		const user = new Player(client.id, username);
		this.onlinePlayers.push(user);
	}

	handleDisconnect(client: Socket) {
		// // console.log(`Client disconnected: ${client.id}`);
		// const index = this.onlinePlayers.findIndex((player) => player.id === client.id);
		// if (index !== -1) {
		//   this.onlinePlayers.splice(index, 1);
		// }
		const index = this.onlinePlayers.findIndex((player) => player.id === client.id);
		if (index !== -1) {
		  this.onlinePlayers.splice(index, 1);
		}
		this.leavePong(client);
	}

	private leavePong(client: Socket)
	{

		// Retirer le client de la file d'attente s'il y est
		this.leaveWaitingQueue(client);

		// Parcourir toutes les salles pour vérifier si le client était présent
		this.pongRooms.forEach((room) => {
			if (room.getPlayerById(client.id)) {
				console.log(`room ${room.id} : `);
				console.log(`player 1 : ${room.player1.username}`);
				console.log(`player 2 : ${room.player2.username}`);
				this.leaveRoom(client, room.id);
			}
		});

	}

	private leaveWaitingQueue(client: Socket) {
		const player = this.waitingPlayers.find((player) => player.id === client.id);

		if (player)
		{
			const index = this.waitingPlayers.indexOf(player);
			if (index !== -1) {
				// Retirez le joueur de la file d'attente
				this.waitingPlayers.splice(index, 1);
				console.log(player.username, ": removed waiting players");
			}
		}
	}

	@SubscribeMessage('leavePong')
	async handleLeavePong(
		@ConnectedSocket() client: Socket
		) {
			this.leavePong(client);
	  }

	private leaveRoom(client: Socket, roomId: string): void {
		const room = this.pongRooms.get(roomId);

		if (room) {

			if (room.gameState == GameState.Playing || room.gameState == GameState.Starting)
			{
				console.log("opponent disconnected : ", room.id);
				if (room.player1.id == client.id)
				{
					this.server.to(room.player2.id).emit('OpponentDisconnected', {});
				}
				else if (room.player2.id == client.id)
				{
					this.server.to(room.player1.id).emit('OpponentDisconnected', {});
				}
				room.setGameState(GameState.Stopped);
			}
			room.removePlayers();
			this.pongRooms.delete(roomId);
			console.log(`Room ${roomId} has been deleted.`);
		}
	}

	private generateRoomId(): string {
		const timestamp = new Date().getTime().toString(36);
		const randomId = Math.random().toString(36).substring(2, 8);
		return `${timestamp}_${randomId}`;
	}

	private createPongRoom(player1: Player, player2: Player): string {
		const roomId = this.generateRoomId();
		let room: Room;

		room = new Room(roomId, player1, player2);

		this.pongRooms.set(roomId, room);
		console.log(`Pong room '${roomId}' created with ${player1.username} & ${player2.username} `);
		return roomId;
	}

	@SubscribeMessage('launchMatchmaking')
	async handleLaunchMatchmaking(
		@ConnectedSocket() client: Socket
		) {
		try {
			let player = this.waitingPlayers.find((player) => player.id === client.id);

			if (player)
				console.log("player found in the waiting queue : ", player.username);

			if (!player) {
				// Ajouter le joueur à la file d'attente
				player = this.onlinePlayers.find((player) => player.id === client.id);

				if (player)
				{
					this.waitingPlayers.push(player);
				}
				// Vérifier si suffisamment de joueurs sont en attente pour former un match
				if (this.waitingPlayers.length >= 2) {
					// Retirer les deux premiers joueurs de la file d'attente
					const player1 = this.waitingPlayers.shift();
					const player2 = this.waitingPlayers.shift();

					// Créer une nouvelle salle pour les deux joueurs
					const newRoomId = this.createPongRoom(player1, player2);

					this.server.to(player1.id).emit('matchmakingSuccess', { roomId: newRoomId, opponentUsername: player2.username });
					this.server.to(player2.id).emit('matchmakingSuccess', { roomId: newRoomId, opponentUsername: player1.username });
				}
			}
		}
		catch (error) {
			console.error(error);
			client.emit('matchmakingError', {
			  message: 'Une erreur s\'est produite lors de la mise en correspondance.',
			});
		  }
	  }

	@SubscribeMessage('removeFromQueue')
	async handleRemoveFromQueue(@ConnectedSocket() client: Socket) {
		this.leaveWaitingQueue(client);
	}

	@SubscribeMessage('chooseGameSettings')
	async handleChooseGameSettings(
		@ConnectedSocket() client: Socket,
		@MessageBody('data')  data: {roomId: string, ballSpeed: number, radius: number, userPaddleColor: string},
		)
		{
		try
		{
			// Ajoutez les données des paramètres de jeu à la salle du joueur
			const room = this.pongRooms.get(data.roomId);


			if (room) {
				const gameSettings = new GameSettingsData(client.id, data.ballSpeed, data.radius, data.userPaddleColor, "");

				if (room.player1.id == client.id)
					room.player1.setGameSettings(gameSettings);
				else if (room.player2.id == client.id)
					room.player2.setGameSettings(gameSettings);

				// Vérifiez si les deux joueurs ont envoyé leurs paramètres
				if (room.player1.gameSettings.ballSpeed && room.player2.gameSettings.ballSpeed) {

					// Générez des valeurs aléatoires à partir des paramètres reçus
					let randomBallSpeed = Math.floor(Math.random() * 2); // 0 ou 1
					let randomBallSize = Math.floor(Math.random() * 2); // 0 ou 1

					if (randomBallSpeed)
						room.setBallSpeed(room.player1.gameSettings.ballSpeed)
					else
						room.setBallSpeed(room.player2.gameSettings.ballSpeed);

					if (randomBallSize)
						room.ball.setRadius(room.player1.gameSettings.radius)
					else
						room.ball.setRadius(room.player2.gameSettings.radius);

					const player1PaddleColor = room.player1.gameSettings.userPaddlecolor;
					const player2PaddleColor = room.player2.gameSettings.userPaddlecolor;

					// Envoyez les paramètres générés à tous les joueurs de la salle
					this.server.to(room.player1.id).emit('settingsSuccess', {radius: room.ball.radius, player1PaddleColor: player1PaddleColor, player2PaddleColor: player2PaddleColor});
					this.server.to(room.player2.id).emit('settingsSuccess', {radius: room.ball.radius, player1PaddleColor: player1PaddleColor, player2PaddleColor: player2PaddleColor});
				}
			}
		}
		catch (error) {
			console.error(error);
			client.emit('chooseGameSettingsError', {
				message: 'Une erreur s\'est produite lors du retrait de la file d\'attente.',
			});
		}
	}

	@SubscribeMessage('movePaddle')
	async handleMovePaddle(
	  @ConnectedSocket() client: Socket,
	  @MessageBody('data')  data: { direction: string, roomId: string }
	) {
	  const room = this.pongRooms.get(data.roomId);

	  if (room) {
		if (client.id === room.player1.id) {
		  if (data.direction === "up") {
			// Utilisez Math.max pour vous assurer que la nouvelle position ne soit pas inférieure à zéro
			room.leftPaddle.setPosition(Math.max(0, room.leftPaddle.y - room.leftPaddle.speed));
		  } else if (data.direction === "down") {
			// Utilisez Math.min pour vous assurer que la nouvelle position ne dépasse pas la hauteur du champ
			room.leftPaddle.setPosition(Math.min(room.fieldHeight - room.leftPaddle.height, room.leftPaddle.y + room.leftPaddle.speed));
		  }
		} else if (client.id === room.player2.id) {
		  if (data.direction === "up") {
			room.rightPaddle.setPosition(Math.max(0, room.rightPaddle.y - room.rightPaddle.speed));
		  } else if (data.direction === "down") {
			room.rightPaddle.setPosition(Math.min(room.fieldHeight - room.rightPaddle.height, room.rightPaddle.y + room.rightPaddle.speed));
		  }
		}
	  }
	}

	private updateScore(room: Room, side: string): void {
		room.ball.setPosition(room.fieldWidth / 2, room.fieldHeight / 2);

		let randomAngle = Math.random() * 2;

		if (side === "right")
		{
			if (randomAngle < 1)
				randomAngle = 22.5 + Math.random() * 45;
			else if (randomAngle < 2)
				randomAngle = 292.5 + Math.random() * 45;
		}
		else if (side === "left")
		{
			if (randomAngle < 1)
				randomAngle = 112.5 + Math.random() * 45;
			else if (randomAngle < 2)
				randomAngle = 202.5 + Math.random() * 45;
		}

		// Convertir l'angle en radians
		const radians = (randomAngle * Math.PI) / 180;
		// Calculer les composantes X et Y en utilisant des fonctions trigonométriques
		room.ball.setSpeedX(room.ballSpeed * Math.cos(radians));
		room.ball.setSpeedY(room.ballSpeed * Math.sin(radians));

		room.leftPaddle.setPosition(room.fieldHeight / 2 - room.leftPaddle.height / 2);
		room.rightPaddle.setPosition(room.fieldHeight / 2 - room.rightPaddle.height / 2);

		if (side === "right")
			room.player1.scoreGoal();
		else if (side === "left")
			room.player2.scoreGoal();

	}

	private updateGameState (room: Room, deltaTime: number)
		{
				room.ball.increaseSpeed();
				room.ball.setPosition(room.ball.x + room.ball.speedX * (deltaTime / 25), room.ball.y + room.ball.speedY * (deltaTime / 25));

				// Vérification de la collision avec un but
				if (room.ball.x + room.ball.radius > room.fieldWidth)
					this.updateScore(room, "right");
				else if (room.ball.x - room.ball.radius < 0)
					this.updateScore(room, "left");

				// Vérification de la collision avec un bord horizontal
				if (room.ball.y + room.ball.radius > room.fieldHeight || room.ball.y - room.ball.radius < 0)
					room.ball.setSpeedY(-room.ball.speedY);

				// Vérifiez les collisions avec les paddles
				if (
					room.ball.x - room.ball.radius < room.leftPaddle.width + 10 &&	// Prend en compte le décalage des raquettes
					room.ball.y + room.ball.radius > room.leftPaddle.y &&
					room.ball.y - room.ball.radius < room.leftPaddle.y + room.leftPaddle.height
				)
				{
					// Collision avec la raquette gauche, inversez la direction horizontale
					room.ball.setSpeedX(-room.ball.speedX);
				}

				if (
					room.ball.x + room.ball.radius > room.fieldWidth - room.leftPaddle.width - 10 &&	// Prend en compte le décalage des raquettes
					room.ball.y + room.ball.radius > room.rightPaddle.y &&
					room.ball.y - room.ball.radius < room.rightPaddle.y + room.leftPaddle.height
				) {
					// Collision avec la raquette droite, inversez la direction horizontale
					room.ball.setSpeedX(-room.ball.speedX);
				}

				if (room.gameState === GameState.Playing && (room.player1.score == room.scoreMax || room.player2.score == room.scoreMax))
				{
					room.setGameState(GameState.Ended);
					this.server.to(room.player1.id).emit('MatchEnded', {});
					this.server.to(room.player2.id).emit('MatchEnded', {});
				}
			}

		private async gameLoop(room: Room) {
			const updateRate = 1000 / 60; // Mise à jour du jeu 60 fois par seconde
			let lastUpdate = Date.now();

			while (room.gameState === GameState.Playing) {

				const currentTime = Date.now();
				const deltaTime = currentTime - lastUpdate;

				if (deltaTime >= updateRate) {
					// Mettez à jour l'état du jeu en fonction du temps écoulé
					this.updateGameState(room, deltaTime);

					// Envoyez les mises à jour aux clients
					this.server.to(room.player1.id).emit("pongUpdate", {ballX: room.ball.x, ballY: room.ball.y, leftPaddleY: room.leftPaddle.y, rightPaddleY: room.rightPaddle.y, player1Score: room.player1.score, player2Score: room.player2.score});
					this.server.to(room.player2.id).emit("pongUpdate", {ballX: room.ball.x, ballY: room.ball.y, leftPaddleY: room.leftPaddle.y, rightPaddleY: room.rightPaddle.y, player1Score: room.player1.score, player2Score: room.player2.score});
					lastUpdate = currentTime;
				}

				await new Promise((resolve) => setTimeout(resolve, 1)); // Attendre une courte période avant la prochaine mise à jour
			}
			if (room.gameState === GameState.Ended)
			{
				// this.server.to(room.player1.id).emit("pongUpdate", {ballX: room.ball.x, ballY: room.ball.y, leftPaddleY: room.leftPaddle.y, rightPaddleY: room.rightPaddle.y, player1Score: room.player1.score, player2Score: room.player2.score});
				// this.server.to(room.player2.id).emit("pongUpdate", {ballX: room.ball.x, ballY: room.ball.y, leftPaddleY: room.leftPaddle.y, rightPaddleY: room.rightPaddle.y, player1Score: room.player1.score, player2Score: room.player2.score});
				this.pongRooms.delete(room.id);
			}
		}

		private startGame(room: Room) {
			room.setGameState(GameState.Playing);

			// Initialisez la position de départ de la balle et sa direction
			room.ball.setPosition(room.fieldWidth / 2, room.fieldHeight / 2);
			room.ball.setRandomDirection(room.ballSpeed);

			// Démarrez la boucle de jeu
			this.gameLoop(room);
		  }

		@SubscribeMessage('startMatch')
		async handleStartMatch(
		  @ConnectedSocket() client: Socket,
		  @MessageBody('data') data: { roomId: string }
		) {
		  const room = this.pongRooms.get(data.roomId);

		  if (room)
		  {
			room.incrementCounter();

			if (room.counter == 2) {
			  room.setGameState(GameState.Playing);
			  this.server.to(room.player1.id).emit('matchStarted', {player1Username: room.player1.username, player2Username: room.player2.username});
			  this.server.to(room.player2.id).emit('matchStarted', {player1Username: room.player1.username, player2Username: room.player2.username});
			  this.startGame(room);
			}
		  }
		}

	@SubscribeMessage('testLog')
	async handleTestLog(
	@ConnectedSocket() client: Socket,
	@MessageBody('message') message: string
	) {
		console.log("log : ", message);
	}
}
