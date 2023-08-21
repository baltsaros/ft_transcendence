import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Channel } from "src/channel/channel.entity";


@Injectable()
export class ChatService {
    constructor(
        @InjectRepository (Channel)
        private readonly channelRepository: Repository<Channel>
    ) {}
    async findChannelUser(channelId: number) {
        const channel = await this.channelRepository.find({
            where: { id: channelId}, 
            relations: ['users'] });
            console.log(channel);
            // There are no user in the log, owner is not a user per se ?
    }
}