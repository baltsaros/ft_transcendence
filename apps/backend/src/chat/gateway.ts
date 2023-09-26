import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, MessageBody, ConnectedSocket} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import { newMessageDto } from 'src/channel/message/new-message.dto';
import { ChatService } from './chat.service';
import { OnEvent } from '@nestjs/event-emitter';
import { OnModuleInit } from '@nestjs/common';


/* The handleConnection function typically takes a parameter that represents the client WebSocket connection that has been established. 
** The Socket type is provided by the socket.io library and represents a WebSocket connection between the server and a client
** It is called when a client successfully establishes a connection w. the ws server, typically when the webpage containing ws logis is loaded
*/
@WebSocketGateway({
    cors: {
      // origin: ['http://localhost:5173'],
      origin: '*',
    },
  })

export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server
  constructor(
    private readonly chatService: ChatService,
  ) {}

  private userMapping =  new Map<string, Socket>();
  private channelMapping = new Map<number, Set<string>>();

  handleConnection(client: Socket){
    // console.log('client ws id:', client.id);
    // console.log('client username:', client.handshake.query.username);
    this.userMapping.set(client.handshake.query.username.toString(), client);
    // console.log(this.userMapping);

  }
  @OnEvent('message.created')
  handleMessage(payload: any) {
    console.log('Message received from:', payload.us);
    // console.log('onMessage event emitted');
    this.server.emit('onMessage', {
      content: payload.content,
      user: payload.user,
      id: payload.id,
      channel: payload.channel
    });
  }

  @OnEvent('channel.created')
  handleNewChannel(payload: any) {
    console.log('channel created event:', payload);
    this.channelMapping.set(payload.id, payload.owner.username);
    console.log('channelMapping:', this.channelMapping);
    this.server.emit('newChannel', payload); // payload is not in line w. state of Redux slice
    // Update the channel - user mapping
    // Emit event to all users
  }
}