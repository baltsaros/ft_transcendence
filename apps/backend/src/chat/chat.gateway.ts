import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Server, Socket } from 'socket.io'

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly chatService: ChatService) {}
/* @MessageBody is a decorator that simplifies the process of extracting data from the incoming WebSocket message and ensures that the data matches the expected structure defined by a DTO.*/
  @SubscribeMessage('createMessage') // event handler w. name of the event
  async createMessage(@MessageBody() payload: CreateMessageDto, client: Socket) { // payload variable should be conform to the structure of the dto. Socket is an object representing an individual WebSocket client connection
    // Broadcast the message to the clients that are on the same channel
    // Need to fetch all user id of the same channel except sender's id ?
    // Persists the message to the db (through service)
  }
}
