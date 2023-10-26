import { Controller, Post, Body } from "@nestjs/common";
import { newMessageDto } from "./new-message.dto";
import { MessageService } from "./message.service";
import { EventEmitter2 } from "@nestjs/event-emitter";

@Controller('message')
export class MessageController {
    constructor(private readonly messageService: MessageService,
        private eventEmitter: EventEmitter2
        ) {}
    @Post()
    async newMessage(@Body() messageData: newMessageDto) {
        const newMessage = await this.messageService.createMessage(messageData);
        this.eventEmitter.emit('messageCreated', newMessage);
        console.log('messageCreated emitted');
    }
}