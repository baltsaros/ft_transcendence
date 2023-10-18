import {
	WebSocketGateway,
	SubscribeMessage,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
	ConnectedSocket
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { GameState, Room } from './entities/room';

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
		  // Parcourir toutes les salles pour vérifier si le client était présent
		  this.pongRooms.forEach((room) => {
			if (room.players.has(client.id)) {
			  this.leavePongRoom(client, room.id);
			}
		});

		// Retirer le client de la file d'attente s'il y est
		const index = this.waitingPlayers.indexOf(client);
		if (index !== -1) {
			this.waitingPlayers.splice(index, 1);
			console.log(`Player ${client.id} removed from the waiting queue.`);
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
	  room.players.add(player2.id);
	  this.pongRooms.set(roomId, room);
	  return roomId;
	}

	  private leavePongRoom(client: Socket, roomId: string): void {
		const room = this.pongRooms.get(roomId);
		if (room) {
		  // Retirer le client de la salle
		  room.players.delete(client.id);

		  // Vérifier si la salle est vide
		  if (room.players.size === 0) {
			// Supprimer la salle de la liste des salles
			this.pongRooms.delete(roomId);
			console.log(`Room ${roomId} has been deleted.`);
		  }
		}
	  }

	@SubscribeMessage('launchMatchmaking')
	async handleLaunchMatchmaking(@ConnectedSocket() client: Socket) {
		try {
		  // Ajouter le joueur à la file d'attente
		  this.waitingPlayers.push(client);

		  // Vérifier si suffisamment de joueurs sont en attente pour former un match
		  if (this.waitingPlayers.length >= 2) {
			// Retirer les deux premiers joueurs de la file d'attente
			const player1 = this.waitingPlayers.shift();
			const player2 = this.waitingPlayers.shift();

			// Créer une nouvelle salle pour les deux joueurs
			const newRoomId = this.createPongRoom(player1, player2);
			client.emit('createdPongRoom', { roomId: newRoomId });
			client.emit('matchmakingSuccess', { roomId: newRoomId });
		  } else {
			// Le joueur attend dans la file d'attente
			client.emit('waitingForMatch', { message: 'En attente d\'un adversaire...' });
		  }
		} catch (error) {
		  console.error(error);
		  client.emit('matchmakingError', {
			message: 'Une erreur s\'est produite lors de la mise en correspondance.',
		  });
		}
	  }
}
