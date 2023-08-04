import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channels } from './channels.entity';
import { IAddChannelsData } from 'src/types/types';

@Injectable() // Injectable decorator allows to inject the service into other Nestjs components like controllers, other services..
export class ChannelsService {
    constructor( // ChannelsService constructor
        @InjectRepository(Channels) // dependency injection of a TypeORM repository, used to inject a rep. of a specific entity (here channels)
        private readonly channelsRepository: Repository<Channels>, // perform CRUD operations on the entity
    ) {}

    async addChannel(channelData: IAddChannelsData) {
        // const channel = await this.channelsRepository.findOne(channelId);
        /* The create method TypeOrm does not involve any interactions with the database
        ** The new entity is only created in the application's memory, and it does not make use of any asynchronous operations.
        */
        const newChannel = this.channelsRepository.create({
            name: channelData.name,
            mode: channelData.mode,
        });
        console.log(channelData.name);
        /* The save method is an asynchronous operation that saves the provided entity (in this case, newChannel)to the database.
        ** Because save is asynchronous, it returns a Promise that resolves when the save operation is completed.*/
        await this.channelsRepository.save(newChannel);
    }
}