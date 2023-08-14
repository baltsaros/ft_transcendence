import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IChannelsData } from 'src/types/types';
import { Repository } from 'typeorm';
import { userChannel } from './userChannel.entity';

@Injectable()
export class userChannelService {
    constructor(
        @InjectRepository(userChannel) 
        private readonly userChannelsRepository: Repository<userChannel>
    ) {}
    async createUserChannel(userChannel: userChannel) {
        const newUserChannel = this.userChannelsRepository.create(
            {
                user: userChannel.user,
                channels: userChannel.channels,
            }
        );
        await this.userChannelsRepository.save(newUserChannel);
        console.log(newUserChannel.id);
    }
}
