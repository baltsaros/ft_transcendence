import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { newMessageDto } from "./new-message.dto";
import { MessageService } from "./message.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";

@Controller('message')
export class MessageController {
    constructor(private readonly messageService: MessageService,
        ) {}
    @Post()
    @UseGuards(JwtAuthGuard)
    async newMessage(@Body() messageData: newMessageDto) {
        console.log('message dto', messageData);
        await this.messageService.createMessage(messageData);
    }
}