import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from 'src/channels/channels.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
 

@Injectable()
export class ChatService {
    constructor (
        @InjectRepository(Channel) private readonly channelRepository: Repository<Channel>
    ) {}
    async JoinChannel(user: User, channel: Channel) {
        console.log(user);
        channel.users.push(user);
        await this.channelRepository.save(channel);
    }
}
