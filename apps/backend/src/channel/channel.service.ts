import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity';
import { IChannelsData, IResponseChannelData ,IGetChannels } from 'src/types/types';
import { UserService } from '../user/user.service';

@Injectable() // Injectable decorator allows to inject the service into other Nestjs components like controllers, other services..
export class ChannelService {
    constructor( // ChannelService constructor
        @InjectRepository(Channel) // dependency injection of a TypeORM repository, used to inject a rep. of a specific entity (here channels)
        private readonly channelRepository: Repository<Channel>, // perform CRUD operations on the entity
        private readonly userService: UserService,
    ) {}
    /* The create method TypeOrm does not involve any interactions with the database
    ** The new entity is only created in the application's memory, and it does not make use of any asynchronous operations.
    ** The save method is an asynchronous operation that saves the provided entity (in this case, newChannel)to the database.
    ** Because save is asynchronous, it returns a Promise that resolves when the save operation is completed.
    */
    async createChannel(channelData: IChannelsData) {
        const user = await this.userService.findOne(channelData.owner);
        const newChannel = this.channelRepository.create({
            name: channelData.name,
            mode: channelData.mode,
            owner: user,
            password: channelData.password,
        });
        console.log('new channel id', newChannel.id);
        console.log('user id', user.id);
        newChannel.users = [user];
        await this.channelRepository.save(newChannel);
        const response : IResponseChannelData = {
            id: newChannel.id,
        }
       return (response);
    }

    async findOne(channelId: number)
    {
        return await this.channelRepository.findOne
        (
            { 
                where: {id: channelId }
            }
        );
    }

    async getChannel(username: string) {
        const channels = await this.channelRepository.find({
            where: {
                owner:{
                    username
                }
            },
        select: ['name', 'id'], // tell TypeOrm to only fetch the name column, so find method returns an array of channel objects, where each object contains only the name property
    });

    return channels;
    }

    /* for the moment this query retrieves all fields fo the channel entity
    ** check w. querybuilder if it can be lighter */
    async getChannelById(channelId: number) {
        const channelMessages = await this.channelRepository.find
        (
            {where: { id: channelId },
            relations: ['channelMessages'],
        })
        return channelMessages;
    }
}