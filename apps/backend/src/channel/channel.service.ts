import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity';
import { IChannelsData, IChannel } from 'src/types/types';
import { UserService } from '../user/user.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable() // Injectable decorator allows to inject the service into other Nestjs components like controllers, other services..
export class ChannelService {
    constructor( // ChannelService constructor
        @InjectRepository(Channel) // dependency injection of a TypeORM repository, used to inject a rep. of a specific entity (here channels)
        private readonly channelRepository: Repository<Channel>, // perform CRUD operations on the entity
        private readonly userService: UserService,
        private eventEmmiter: EventEmitter2
    ) {}
    /* The create method TypeOrm does not involve any interactions with the database
    ** The new entity is only created in the application's memory, and it does not make use of any asynchronous operations.
    ** The save method is an asynchronous operation that saves the provided entity (in this case, newChannel)to the database.
    ** Because save is asynchronous, it returns a Promise that resolves when the save operation is completed.
    */
    async createChannel(channelData: IChannelsData): Promise<IChannel> {
        const user = await this.userService.findOne(channelData.owner.username);
        const existingChannel = await this.channelRepository.findOne({where: {name: channelData.name}});
        if (existingChannel) throw new BadRequestException("Channel already exists");
        const newChannel = this.channelRepository.create({
            name: channelData.name,
            mode: channelData.mode,
            owner: user,
            password: channelData.password,
        });
        newChannel.users = [user];
        // newChannel.users.push(user)
        const channel = await this.channelRepository.save(newChannel);
        this.eventEmmiter.emit('channel.created', channel);
        const returnedChannel: IChannel = {
            id: channel.id,
            name: channel.name,
        }
        return (returnedChannel);
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

    async findAll(username: string) {
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
        const channel = await this.channelRepository.findOne
        (
            {where: { id: channelId },
            relations: ['channelMessages', 'channelMessages.user'],
        })
        return channel;
    }
}