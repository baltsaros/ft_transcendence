import {
	WebSocketGateway,
	SubscribeMessage,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
	ConnectedSocket,
	MessageBody
} from '@nestjs/websockets';
import { platform } from 'os';
import { instance } from "../../../frontend/src/api/axios.api";

import { Server, Socket } from 'socket.io';
import { GameSettingsData, GameState, Room } from './entities/room';

  @WebSocketGateway({ namespace: '/pong', cors: { origin: '*' } })
  export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;

	private pongRooms: Map<string, Room> = new Map();
	// Liste d'attente des joueurs en attente de match
	private waitingPlayers: Socket[] = [];

	handleConnection(client: Socket) {
		console.log(`Client connected: ${client.id}`);
	}

	handleDisconnect(client: Socket) {
		console.log(`Client disconnected: ${client.id}`);

		// Retirer le client de la file d'attente s'il y est
		const index = this.waitingPlayers.indexOf(client);
		if (index !== -1) {
			this.waitingPlayers.splice(index, 1);
			console.log(`Player ${client.id} removed from the waiting queue.`);
		}
		else {
			// console.log("ici");
			// Parcourir toutes les salles pour vérifier si le client était présent
			this.pongRooms.forEach((room) => {
			if (room.players.has(client.id)) {
				this.leavePongRoom(client, room.id);
			}
		});
		}
	}

	private generateRoomId(): string {
		const timestamp = new Date().getTime().toString(36);
		const randomId = Math.random().toString(36).substring(2, 8);
		return `${timestamp}_${randomId}`;
	}

	private createPongRoom(player1: Socket, player2: Socket): string {
		const roomId = this.generateRoomId();
		const room = new Room(roomId);
		room.players.add(player1.id);
		room.setLeftPaddle(player1.id);

		room.players.add(player2.id);
		room.setRightPaddle(player2.id);

		this.pongRooms.set(roomId, room);
		console.log(`Room ${roomId} has been created.`);

		return roomId;
	}

	private leavePongRoom(client: Socket, roomId: string): void {
		const room = this.pongRooms.get(roomId);

		if (room) {
			//Retirer le client de la salle
			room.players.delete(client.id);

			room.players.forEach((player) => {
				this.server.to(player).emit('OpponentDisconnected', {});
			});

			this.pongRooms.delete(roomId);
			console.log(`Room ${roomId} has been deleted.`);
		}
	}


	@SubscribeMessage('launchMatchmaking')
	async handleLaunchMatchmaking(@ConnectedSocket() client: Socket) {
		try {
			if (!this.waitingPlayers.includes(client)) {
				// Ajouter le joueur à la file d'attente
			this.waitingPlayers.push(client);
				// Vérifier si suffisamment de joueurs sont en attente pour former un match
				if (this.waitingPlayers.length >= 2) {
					// Retirer les deux premiers joueurs de la file d'attente
					const player1 = this.waitingPlayers.shift();
					const player2 = this.waitingPlayers.shift();

					// Créer une nouvelle salle pour les deux joueurs
					const newRoomId = this.createPongRoom(player1, player2);
					// Envoyez l'événement `createdPongRoom` à tous les joueurs de la salle
					[player1, player2].forEach((player) => {
						player.emit('createdPongRoom', {roomId: newRoomId});
					});

					// Vous pouvez également envoyer un événement `matchmakingSuccess` si nécessaire
					[player1, player2].forEach((player) => {
						player.emit('matchmakingSuccess', { roomId: newRoomId });
					});
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
			const index = this.waitingPlayers.indexOf(client);
			if (index !== -1) {
				// Retirez le joueur de la file d'attente
				this.waitingPlayers.splice(index, 1);
				console.log(`Player ${client.id} removed from the waiting queue.`);
			}
		}
		catch (error) {
			console.error(error);
			client.emit('removeFromQueueError', {
				message: 'Une erreur s\'est produite lors du retrait de la file d\'attente.',
			});
		}
	}


	private generateRandomGameSettings(settings: GameSettingsData[]): GameSettingsData {
		// Sélectionnez aléatoirement un index entre 0 et 1 (pour choisir entre les deux objets)
		const randomBallSpeed = Math.floor(Math.random() * 2); // 0 ou 1
		const randomColor = Math.floor(Math.random() * 2); // 0 ou 1
		const randomRadius = Math.floor(Math.random() * 2); // 0 ou 1

		// Obtenez les deux objets GameSettingsData du tableau
		const setting1 = settings[0];
		const setting2 = settings[1];

		// Créez un nouvel objet GameSettingsData en utilisant des valeurs aléatoires des deux objets
		const randomSettings = new GameSettingsData(
		  randomBallSpeed === 0 ? setting1.ballSpeed : setting2.ballSpeed,
		  randomRadius === 0 ? setting1.radius : setting2.radius,
		  randomColor === 0 ? setting1.color : setting2.color
		);

		return randomSettings;
	}

	@SubscribeMessage('chooseGameSettings')
	async handleChooseGameSettings(
		@ConnectedSocket() client: Socket,
		@MessageBody('data')  data: {roomId: string, gameSettingsData: GameSettingsData},
		)
		{
		try
		{
			// Ajoutez les données des paramètres de jeu à la salle du joueur
			const room = this.pongRooms.get(data.roomId);
			if (room) {
				room.addGameSettings(data.gameSettingsData);
				// Vérifiez si les deux joueurs ont envoyé leurs paramètres
				if (room.gameSettings.length === 2) {
					// Générez des valeurs aléatoires à partir des paramètres reçus
					const randomSettings = this.generateRandomGameSettings(room.gameSettings);
					// Envoyez les paramètres générés à tous les joueurs de la salle
					room.players.forEach((player) => {
							this.server.to(player).emit('settingsSuccess', randomSettings);
						}
					);
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
				room.players.forEach((player) => {
					if (player != client.id) {
						this.server.to(player).emit('opponentMovePaddle', {direction: direction});
					}
				});
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
				console.log("client : ", client.id);
				if (room.leftPaddle == client.id)
					client.emit('sendPaddle', {paddle: "left"})
				else if (room.rightPaddle == client.id)
					client.emit('sendPaddle', {paddle: "right"})
			}
		}

		@SubscribeMessage('endMatch')
		async handleEndMatch(
			@ConnectedSocket() client: Socket,
			@MessageBody('data')  data: {username:string, roomId: string, score: number}
			)
			{
				const room = this.pongRooms.get(data.roomId);
				const score = data.score;
				const username = data.username;

				if (room)
				{
					if (!room.player1.score && !room.player1.username)
					{
						room.setPlayer1Score(data.score);
						room.setPlayer1Username(data.username);
					}
					else
					{
						console.log("ici");
						room.setPlayer2Score(score);
						room.setPlayer2Username(username);
						const { data } = await instance.post("matches/", {
							username: room.player1.username,
							opponent: room.player2.username,
							scoreuser: room.player1.score,
							scoreOpponent: room.player2.score
						});
					}
				}
			}

	@SubscribeMessage('testLog')
	async handleTestLog(@ConnectedSocket() client: Socket, @MessageBody('message') message: string) {
		console.log("log : ", message);
	}
}
