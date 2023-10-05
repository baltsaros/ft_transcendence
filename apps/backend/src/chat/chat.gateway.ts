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

export class ChatGateway {
  @WebSocketServer()
  server: Server
  constructor(
    private readonly chatService: ChatService,
  ) {}

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('connected');
    })
  }
  
  @SubscribeMessage('test')
    onTest(@MessageBody() body: any) {
      console.log(body);
    }

    @OnEvent('message.created')
    handleMessage(payload: any) {
      console.log('onMessage event emitted');
      this.server.emit('onMessage', {
        content: payload.content,
        user: payload.user,
        id: payload.id,
        channel: payload.channel
      });
    }
}


 /* In the handleConnection and handleDisconnect methods, you can define the logic
 ** to handle new client connections and disconnections.*/
  // handleConnection(client: Socket) {
  //   console.log(`Client connected: ${client.id}`);

  // }

  // handleDisconnect(client: Socket) {
  //   console.log(`Client disconnected: ${client.id}`);
  // }



/* @MessageBody is a decorator that simplifies the process of extracting data from the incoming WebSocket message and ensures that the data matches the expected structure the DTO.*/
// @SubscribeMessage('createMessage') // event handler w. name of the event
  // async createMessage(@MessageBody() payload: CreateMessageDto, client: Socket) { // payload variable should be conform to the structure of the dto. Socket is an object representing an individual WebSocket client connection