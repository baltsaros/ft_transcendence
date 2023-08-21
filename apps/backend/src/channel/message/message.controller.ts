import { Controller, Post, Body } from "@nestjs/common";
import { newMessageDto } from "./new-message.dto";
import { MessageService } from "./message.service";

@Controller('message')
export class MessageController {
    constructor(private readonly messageService: MessageService ) {}
    @Post()
    async newMessage(@Body() messageData: newMessageDto) {
        await this.messageService.createMessage(messageData);
    }
}