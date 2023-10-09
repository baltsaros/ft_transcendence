import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity';
import { IChannelsData, IChannel } from 'src/types/types';
import { UserService } from '../user/user.service';
import { ChannelUserDto } from './dto/channelUser.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ChannelPasswordDto } from './dto/channelPassword.dto';
import { ChannelIdDto } from './dto/channelIdDto.dto';

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
    async createChannel(channelData: IChannelsData) {
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
        const channel = await this.channelRepository.save(newChannel);
        return channel;
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

    async findAll() {
        const channel = await this.channelRepository.find(
            {
                relations: {
                    users: true,
                }
            }
        );
        return channel;
    }

    async fetchMessage(id: number) {
      const channelMessage = await this.channelRepository.findOne({
        where: {id: id},
        relations: ["messages", "messages.user"],
      })
      return channelMessage;
    }
  
    async kickMemberOfChannel(relation: ChannelUserDto)
    {
        const request = await this.channelRepository.findOne({
            relations: {
              users: true,
            },
            where: { id: relation.idChannel}
          });
      
          request.users = request.users.filter((user) => {
            return (user.id !== relation.idUser)
          })
          const channel = await this.channelRepository.save(request);
          if (channel) return true;
          return false;
    }

    async setPasswordToChannel(channelPassword: ChannelPasswordDto)
    {
        const channel = await this.findOne(channelPassword.idChannel);
        if (!channel) return (false);
       await this.channelRepository.update({
            id: channelPassword.idChannel},
            {
                password: channelPassword.password
        });
        const newChannel = await this.findOne(channelPassword.idChannel);
        if (channel.password === newChannel.password) return (false);
        return (true);
    }

    async addUserAsAdmin(channelRelation: ChannelUserDto)
    {
        const channel = await this.channelRepository.findOne({
        where: { id: channelRelation.idUser, },
        relations: {
            adminUsers: true,
        },
        })
        const admin = await this.userService.findOneById(channelRelation.idUser);
        if (!admin) return (false);
        channel.adminUsers.push(admin);

        await this.channelRepository.save(channel);
        return (true);
    }

    async removeUserAsAdmin(channelRelation: ChannelUserDto) {
        const request = await this.channelRepository.findOne({
          relations: {
            adminUsers: true,
          },
          where: { id: channelRelation.idUser}
        });
    
        request.adminUsers = request.adminUsers.filter((user) => {
          return (user.id !== channelRelation.idUser)
        })
        const isOk = await this.channelRepository.save(request);
        return (isOk);
      }
    
      async getAllAdminsOfChannel(channelId: ChannelIdDto) {
        const request = await this.channelRepository.findOne({
          relations: {
            adminUsers: true,
          },
          where: { id: channelId.idChannel}
        });
    
        return (request.adminUsers);
      }

      async checkIfSamePassword(relation: ChannelPasswordDto) {
        const channel = await this.findOne(relation.idChannel);
        if (channel.password === relation.password) return (true);
        return (false);
      }

}