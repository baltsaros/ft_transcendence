import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, MessageBody, ConnectedSocket} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import { newMessageDto } from 'src/channel/message/new-message.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { GatewaySessionManager } from './gateway.session';
import { ChannelService } from 'src/channel/channel.service';
import { UserService } from 'src/user/user.service';
import { Channel } from 'src/channel/channel.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { GameState, Room } from './entities/room';


/* The handleConnection function typically takes a parameter that represents the client WebSocket connection that has been established. 
** The Socket type is provided by the socket.io library and represents a WebSocket connection between the server and a client
** It is called when a client successfully establishes a connection w. the ws server, typically when the webpage containing ws logis is loaded
*/
// websocket.gateway.ts



@WebSocketGateway({
  cors: {
    origin: '*',
  },
})

export class MainWebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  server: Server;
  constructor(
    // private readonly chatService: ChatService,
    @InjectRepository(Channel) private readonly channelRepository: Repository<Channel>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly gatewaySessionManager: GatewaySessionManager,
    private readonly channelService: ChannelService,
    private readonly userService: UserService,
  ) {}


//  ************************** PONG MANAGER **************************
private pongRooms: Map<string, Room> = new Map();

// Crée une nouvelle salle Pong
createPongRoom(client: Socket): string {
    const roomId = this.generateRoomId(); // Générer un identifiant unique pour la salle
    const room = new Room(roomId);
    room.players.add(client.id);
    this.pongRooms.set(roomId, room);
    return roomId;
  }

  // Génère un identifiant unique pour la salle
  private generateRoomId(): string {
	const timestamp = new Date().getTime().toString(36);
	const randomId = Math.random().toString(36).substring(2, 8);
	return `${timestamp}_${randomId}`;
  }

joinPongRoom(client: Socket, roomId: string): void {
	const room = this.pongRooms.get(roomId);

	room.setGameState(GameState.inGame);
	room.players.add(client.id);
}

// Gestion de l'événement "launchMatchmaking" côté serveur
@SubscribeMessage('launchMatchmaking')
handleLaunchMatchmaking(client: Socket) {
  // Trouver une salle disponible
  const availableRoom = Array.from(this.pongRooms.values()).find(
	(room) => room.gameState === GameState.Waiting && room.players.size === 1,
  );

  if (availableRoom) {
	// Rejoindre une salle disponible
	this.joinPongRoom(client, availableRoom.id);
  } else {
	// Créer une nouvelle salle si aucune salle disponible n'a été trouvée
	const newRoomId = this.createPongRoom(client);
	// Émettre un événement pour informer le client du nouvel ID de la salle
	client.emit('createdPongRoom', newRoomId);
  }
}

//  ************************** CHAT MANAGER **************************
  async handleConnection(client: Socket){
    console.log(client.id);
    const username = client.handshake.query.username.toString();
    // 1. Retrieve the channels the client is member of
    const channel = await this.channelService.findAll();
    // console.log('all:', channel);
    const filteredChannel = channel.filter((channel) =>
      channel.users.some((user) =>
      user.username === username)
    )
    // 2. Make him join each room.
    filteredChannel.forEach((channel) => {
      client.join(channel.id.toString())
      console.log("client joined:", channel.name);
    });
  }

  handleDisconnect(client: any) {
    // this.gatewaySessionManager.removeSocket(client.handshake.query.username.toString())
  }

  @OnEvent('message.created')
  handleMessage(payload: any) {
    console.log('event emitted to', payload.channel.id);
    // this.server.to(payload.channel.id).emit('onMessage', {
    //   content: payload.content,
    //   user: payload.user,
    //   id: payload.id,
    //   channel: payload.channel
    // });
    this.server.emit('onMessage', {
      content: payload.content,
      user: payload.user,
      id: payload.id,
      channel: payload.channel
    });
  }

  // @OnEvent('channel.created')
  // handleNewChannel(payload: any) {
  //   console.log('channel created event:', payload);

  //   this.server.emit('newChannel', payload); // payload is not in line w. state of Redux slice
  // }

  @SubscribeMessage('onNewChannel')
  async onNewChannel(client: Socket, payload: any) {
    console.log('channelId:', payload.channelId)
    console.log('id:', payload.id)
    client.join(payload.id);
    // this.server.to(payload.id).emit('channelCreated', payload);
  }

  /* any should be specified */
  @SubscribeMessage('onChannelJoin')
  async onChannelJoin(client: Socket, payload: any) {
    console.log('client', client.id);
    console.log('payload', payload);
    try{
      const channel = await this.channelRepository.findOne({
        where: {
          id: payload.channelId,
        },
        relations: {
          users: true,
        },
      })
      const user = await this.userService.findOne(payload.username);
      channel.users.push(user);
      await this.channelRepository.save(channel);
      const channelId = channel.id;
      const value = {
        channelId,
        user,
      };
      client.join(payload.channelId);
      this.server.to(payload.channelId).emit('userJoined', value);
      console.log(client.rooms);
      // client.emit('userJoined', payload);

    }catch (error){
      console.log("error joining channel");
    }
  }

  @SubscribeMessage('onChannelLeave')
  async onChannelLeave(client: Socket, payload: any) {
    try{
      const channel = await this.channelRepository.findOne({
        where: {
          id: payload.channelId,
        },
        relations: {
          users: true,
        },
      })
      const user = await this.userService.findOne(payload.username);
      channel.users = channel.users.filter((usr) => usr.id !== user.id);
      await this.channelRepository.save(channel);
      console.log('channel users after table update:', channel.users);
      // this.server.emit('userLeft', payload);
      this.server.to(payload.channelId).emit('userLeft', payload);
      client.leave(payload.channelId);
    }catch (error) {
      console.log('error leaving channel')
    }
  }
}

