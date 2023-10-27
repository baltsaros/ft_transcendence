import {
	WebSocketGateway,
	SubscribeMessage,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
	ConnectedSocket,
	MessageBody
} from '@nestjs/websockets';
import Cookies from 'js-cookie';
import { platform } from 'os';
// import { instance } from "../../../frontend/src/api/axios.api";

import { Server, Socket } from 'socket.io';
import { MissingPrimaryColumnError } from 'typeorm';
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
		const player = new Player(client.id, username);
		this.onlinePlayers.push(player);
	}

	handleDisconnect(client: Socket) {
		// console.log(`Client disconnected: ${client.id}`);
		let index = this.onlinePlayers.findIndex((player) => player.id === client.id);
		if (index !== -1) {
		  this.onlinePlayers.splice(index, 1);
		}
		// Retirer le client de la file d'attente s'il y est
		index = this.waitingPlayers.findIndex((player) => player.id === client.id);
		if (index !== -1) {
			this.waitingPlayers.splice(index, 1);
			// console.log(`Player ${client.id} removed from the waiting queue.`);
		}
		else {
			// Parcourir toutes les salles pour vérifier si le client était présent
			this.pongRooms.forEach((room) => {
			if (room.getPlayerById(client.id)) {
				this.leavePongRoom(client, room.id);
			}
		});
		}
	}

	private leavePongRoom(client: Socket, roomId: string): void {
		const room = this.pongRooms.get(roomId);
		let user: Player;

		if (room) {
			//Retirer le client de la salle
			user = room.getPlayerById(client.id);

			if (room.gameState == GameState.Playing)
			{
				if (room.player1.id == user.id)
					this.server.to(room.player2.id).emit('OpponentDisconnected', {});
				else if (room.player2.id == user.id)
					this.server.to(room.player1.id).emit('OpponentDisconnected', {});
			}
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

			if (!player) {
				// Ajouter le joueur à la file d'attente
				player = this.onlinePlayers.find((player) => player.id === client.id);

				if (player)
					this.waitingPlayers.push(player);
				// Vérifier si suffisamment de joueurs sont en attente pour former un match
				if (this.waitingPlayers.length >= 2) {
					// Retirer les deux premiers joueurs de la file d'attente
					const player1 = this.waitingPlayers.shift();
					const player2 = this.waitingPlayers.shift();

					// Créer une nouvelle salle pour les deux joueurs
					const newRoomId = this.createPongRoom(player1, player2);

					this.server.to(player1.id).emit('matchmakingSuccess', { roomId: newRoomId });
					this.server.to(player2.id).emit('matchmakingSuccess', { roomId: newRoomId });
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
		try {
			// Vérifiez d'abord si le joueur est dans la file d'attente
			const player = this.waitingPlayers.find((player) => player.id === client.id);

			if (player)
			{
				const index = this.waitingPlayers.indexOf(player);
				if (index !== -1) {
					// Retirez le joueur de la file d'attente
					this.waitingPlayers.splice(index, 1);
				}
			}
		}
		catch (error) {
			console.error(error);
			client.emit('removeFromQueueError', {
				message: 'Une erreur s\'est produite lors du retrait de la file d\'attente.',
			});
		}
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

				console.log(gameSettings.ballSpeed);
				if (room.player1.id == client.id)
					room.player1.setGameSettings(gameSettings);
				else if (room.player2.id == client.id)
					room.player2.setGameSettings(gameSettings);

				// Vérifiez si les deux joueurs ont envoyé leurs paramètres
				if (room.player1.gameSettings.ballSpeed && room.player2.gameSettings.ballSpeed) {
					let player1Color: string;
					let player2Color: string;

					// Générez des valeurs aléatoires à partir des paramètres reçus
					let randomBallSpeed = Math.floor(Math.random() * 2); // 0 ou 1
					let randomBallSize = Math.floor(Math.random() * 2); // 0 ou 1

					randomBallSpeed === 0 ? room.player1.gameSettings.ballSpeed : room.player2.gameSettings.ballSpeed;
					randomBallSize === 0 ? room.player1.gameSettings.radius : room.player2.gameSettings.radius;

					if (room.player1.id == client.id)
					{
						player1Color = room.player1.gameSettings.userPaddlecolor;
						player2Color = room.player2.gameSettings.userPaddlecolor;
					}
					else if (room.player2.id == client.id)
					{
						player1Color = room.player2.gameSettings.userPaddlecolor;
						player2Color = room.player1.gameSettings.userPaddlecolor;
					}
					room.ball.setRadius(randomBallSize);
					room.ball.setSpeed(randomBallSpeed, randomBallSpeed);
					// Envoyez les paramètres générés à tous les joueurs de la salle
					this.server.to(room.player1.id).emit('settingsSuccess', {userPaddleColor: player1Color, opponentPaddleColor: player2Color});
					this.server.to(room.player2.id).emit('settingsSuccess', {userPaddleColor: player2Color, opponentPaddleColor: player1Color});
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
		@MessageBody('data')  data: {direction: string, roomId: string}
		)
		{
			const direction = data.direction;
			const room = this.pongRooms.get(data.roomId);
			if (room) {
				if (room.player1.id == client.id)
					this.server.to(room.player2.id).emit('opponentMovePaddle', {direction: direction});
				else if (room.player2.id == client.id)
					this.server.to(room.player1.id).emit('opponentMovePaddle', {direction: direction});
			}
		}

	@SubscribeMessage('getPaddle')
	async handleGetPaddle(
		@ConnectedSocket() client: Socket,
		@MessageBody('data')  data: {roomId: string}
		)
		{
			const room = this.pongRooms.get(data.roomId);

			if (room)
			{
				if (room.leftPaddle.player.id == client.id)
					client.emit('sendPaddle', {paddle: "left"})
				else if (room.rightPaddle.player.id  == client.id)
					client.emit('sendPaddle', {paddle: "right"})
			}
		}

	@SubscribeMessage('endMatch')
	async handleEndMatch( @ConnectedSocket() client: Socket, @MessageBody('data')  data: {roomId: string, score: number} )
	{
			const room = this.pongRooms.get(data.roomId);
			if (room)
			{
				let isMatchEnded = true;
				if (room.player1.id == client.id) {
					room.player1.setScore(data.score);
				}
				else if (room.player2.id == client.id) {
					room.player2.setScore(data.score);
				}

				if (room.player1.score == -1 || room.player2.score == -1)
					isMatchEnded = false;

				if (isMatchEnded)
				{
					room.setGameState(GameState.Ended);
					this.server.to(room.player1.id).emit('matchEnded', {});
					this.server.to(room.player2.id).emit('matchEnded', {});
				}
			}
		}

	@SubscribeMessage('testLog')
	async handleTestLog(@ConnectedSocket() client: Socket, @MessageBody('message') message: string) {
		// console.log("log : ", message);
	}
}
