import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channels } from './channels.entity';
import { IAddChannelsData, IGetChannels } from 'src/types/types';
import { UserService } from '../user/user.service'

@Injectable() // Injectable decorator allows to inject the service into other Nestjs components like controllers, other services..
export class ChannelsService {
    constructor( // ChannelsService constructor
        @InjectRepository(Channels) // dependency injection of a TypeORM repository, used to inject a rep. of a specific entity (here channels)
        private readonly channelsRepository: Repository<Channels>, // perform CRUD operations on the entity
        private readonly userService: UserService
    ) {}

    async addChannel(channelData: IAddChannelsData) {
        /* The create method TypeOrm does not involve any interactions with the database
        ** The new entity is only created in the application's memory, and it does not make use of any asynchronous operations.*/
       const user = await this.userService.findOne(channelData.owner);
        const newChannel = this.channelsRepository.create({
            name: channelData.name,
            mode: channelData.mode,
            owner: user,
            password: channelData.password,
        });
        console.log(channelData.name);
        console.log(channelData.mode);
        console.log(user.username);
        console.log(channelData.password);
        /* The save method is an asynchronous operation that saves the provided entity (in this case, newChannel)to the database.
        ** Because save is asynchronous, it returns a Promise that resolves when the save operation is completed.*/
        await this.channelsRepository.save(newChannel);
    }

    async getChannel(username: string) {
        console.log("2");
        const channels = await this.channelsRepository.find({
            where: {
                owner:{
                    username
                }
            },
        select: ['name'], // tell TypeOrm to only fetch the name column, so find method returns an array of channel objects, where each object contains only the name property
    });

    /* Map takes an array of elements and transforms each element using the supplied function */
    return channels.map(channels => channels.name);
    }
}