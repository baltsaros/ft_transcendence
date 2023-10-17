import {
	WebSocketGateway,
	SubscribeMessage,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
	ConnectedSocket
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

  enum GameState {
	Waiting = 'Waiting',
	inGame = 'inGame'
}

  class Room {
	id: string;
	players: Set<string> = new Set();
	gameState: GameState = GameState.Waiting;

	constructor(roomId: string) {
	  this.id = roomId;
	}

	setGameState(state: GameState) {
	  this.gameState = state;
	}
  }

  @WebSocketGateway({ namespace: '/pong', cors: { origin: '*' } })
  export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;

	private pongRooms: Map<string, Room> = new Map();

	handleConnection(client: Socket) {
	  console.log(`Client connected: ${client.id}`);
	  // Autres logiques de connexion si nécessaires
	}

	handleDisconnect(client: Socket) {
	  console.log(`Client disconnected: ${client.id}`);
	  // Autres logiques de déconnexion si nécessaires
	}

	private generateRoomId(): string {
	  const timestamp = new Date().getTime().toString(36);
	  const randomId = Math.random().toString(36).substring(2, 8);
	  return `${timestamp}_${randomId}`;
	}

	private createPongRoom(client: Socket): string {
	  const roomId = this.generateRoomId();
	  const room = new Room(roomId);
	  room.players.add(client.id);
	  this.pongRooms.set(roomId, room);
	  return roomId;
	}

	private joinPongRoom(client: Socket, roomId: string): void {
	  const room = this.pongRooms.get(roomId);
	  room.setGameState(GameState.inGame);
	  room.players.add(client.id);
	}

	@SubscribeMessage('launchMatchmaking')
	async handleLaunchMatchmaking(@ConnectedSocket() client: Socket) {
	  try {
		client.emit('testMessage', { content: 'This is a test message from the server' });

		const availableRoom = Array.from(this.pongRooms.values()).find(
		  (room) => room.gameState === GameState.Waiting && room.players.size === 1
		);

		if (availableRoom) {
		  this.joinPongRoom(client, availableRoom.id);
		  client.emit('matchmakingSuccess', { roomId: availableRoom.id });
		} else {
		  const newRoomId = this.createPongRoom(client);
		  client.emit('createdPongRoom', { roomId: newRoomId });
		  client.emit('matchmakingSuccess', { roomId: newRoomId });
		}
	  } catch (error) {
		console.error(error);
		client.emit('matchmakingError', { message: 'Une erreur s\'est produite lors de la mise en correspondance.' });
	  }
	}
}
