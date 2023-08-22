import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import { newMessageDto } from 'src/channel/message/new-message.dto';
import { ChatService } from './chat.service';


/* The handleConnection function typically takes a parameter that represents the client WebSocket connection that has been established. 
** The Socket type is provided by the socket.io library and represents a WebSocket connection between the server and a client
** It is called when a client successfully establishes a connection w. the ws server, typically when the webpage containing ws logis is loaded
*/
@WebSocketGateway({
    cors: {
      origin: '*',
    },
  })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server
  constructor(
    private readonly chatService: ChatService
  ) {}

  handleConnection(client: Socket) {
    // console.log(`Client connected: ${client.id}`);
    // Handle connection event
  }

  handleDisconnect(client: Socket) {
    // console.log(`Client disconnected: ${client.id}`);
    // Handle disconnection event
  }
  
  @SubscribeMessage('test')
  handleTestEvent(client: Socket, data: any) {
  console.log("event");
  console.log(data);
  
  // Emit response back to client
  client.emit('test', { message: 'Received your test event' });
}

  @SubscribeMessage('message')
  async handleMessageEvent(client: Socket, data: newMessageDto) {
    console.log('message event received from', data.channelId);
    // 1. Fetch users from user_channel join table w. channel id 
    const userInChannel = await this.chatService.findChannelUser(data.channelId);
    // 2. Broadcast message to client in the same channel
    // client.emit('message', data);
    userInChannel.forEach((user) => {
      
    });
  }
}

// @SubscribeMessage('join')
// async handleJoinEvent(@MessageBody() payload: JoinChannelDto) {}
// call service to update userChannel entity
//   const user = await this.userService.findOne(payload.name);
//   const channel = await this.channelService.findOne(payload.channelId);
//   await this.chatService.JoinChannel(user, channel);

/* @MessageBody is a decorator that simplifies the process of extracting data from the incoming WebSocket message and ensures that the data matches the expected structure the DTO.*/
// @SubscribeMessage('createMessage') // event handler w. name of the event
  // async createMessage(@MessageBody() payload: CreateMessageDto, client: Socket) { // payload variable should be conform to the structure of the dto. Socket is an object representing an individual WebSocket client connection
    
    
    // Broadcast the message to the clients that are on the same channel
    // Need to fetch all user id of the same channel except sender's id ?
    // Persists the message to the db (through service)

    /* Sample code */

    // handleMessage(@MessageBody() payload: CreateMessageDto, client: Socket): void {
    // // Validate the incoming message
    // // ...

    // // Broadcast the message to other clients
    // const message = { user: client.id, text: payload.text };
    // this.server.emit('message', message);

    // // Persist the message to the database (optional)
    // this.chatService.saveMessageToDatabase(message);
  // }
