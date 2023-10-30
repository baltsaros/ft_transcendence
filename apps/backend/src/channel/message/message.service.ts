import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Message } from "./messages.entity";
import { Repository } from "typeorm";
import { newMessageDto } from "./new-message.dto";
import { UserService } from "src/user/user.service";
import { ChannelService } from "../channel.service";
import { EventEmitter2 } from "@nestjs/event-emitter";

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
        private readonly userService: UserService,
        private readonly channelService: ChannelService,
        private eventEmmiter: EventEmitter2,
    ) {}

    async createMessage(messageData: newMessageDto) {
        const user = await this.userService.findOne(messageData.username);
        const channel = await this.channelService.findOne(messageData.channelId);
        const newMessage = this.messageRepository.create(
            {
                user: user,
                channel: channel,
                content: messageData.content
            })
            await this.messageRepository.save(newMessage);
            const payload = {
                channelId: channel.id,
                username: user.username,
                content: messageData.content,
            }
            this.eventEmmiter.emit('messageCreated', payload);
    }
}