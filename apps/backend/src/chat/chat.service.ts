import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-message.dto';
import { Chat } from './entities/chat.entity'; 

@Injectable()
export class ChatService {
  messages: Chat[] = [{username: 'hdony', content: 'Hello'}];
  clientToUser = {};
  create(createChatDto: CreateChatDto) {
    const message = {...createChatDto};
    this.messages.push(message); //object from the front endk
    return (message);
  }

  findAll() {
    return this.messages; //typeorm query to db
  }

  identify(name: string, clientId: string) {
    this.clientToUser[clientId] = name; //mapping of clientId to username

    return Object.values(this.clientToUser);
  }

  getClientName(clientId: string){
    return this.clientToUser[clientId];
  }
}
