import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity';
import { IChannelsData, IChannelDmData } from 'src/types/types';
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
    async createChannel(channelData: IChannelsData) {
        const user = await this.userService.findOne(channelData.owner.username);
        const existingChannel = await this.channelRepository.findOne({where: {name: channelData.name}});
        if (existingChannel) {
          return undefined;
        } 
        const newChannel = this.channelRepository.create({
            name: channelData.name,
            mode: channelData.mode,
            owner: user,
            password: channelData.password,
        });
        newChannel.messages = [];
        newChannel.users = [user];
        newChannel.messages = [];
        const channel = await this.channelRepository.save(newChannel);
        this.eventEmmiter.emit('newChannel', channel);
        return channel;
    }

    async createDmChannel(channelDmData: IChannelDmData) {
      const sender = await this.userService.findOneById(channelDmData.sender);
      const existingChannel = await this.channelRepository.findOne({where: {name: channelDmData.name}});
        if (existingChannel) {
          return undefined;
        } 
      const receiver = await this.userService.findOne(channelDmData.receiver);
      const newDmChannel = this.channelRepository.create({
        name: channelDmData.name,
        mode: channelDmData.mode,
        owner: sender,
        password: channelDmData.password,
        users: [sender, receiver],
      });
      const dmChannel = await this.channelRepository.save(newDmChannel);
      return(dmChannel);
    }

    async leaveChannel(payload: any) {
      const channel = await this.channelRepository.findOne({
        where: {
          id: payload.channelId,
        },
        relations: {
          users: true,
          owner: true,
        },
      })
      const user = await this.userService.findOne(payload.username);
      if (user.id === channel.owner.id) {
        // 1. check if there are users in the channel, if not prevent owner from leaving the channel
        if (channel.users.length > 1) {
          // 1. remove the owner as user and as owner
          channel.users = channel.users.filter((usr) => usr.id !== user.id);
          // 2. set new owner, for now it's a user that replaces the owner but it should be an admin
          const randomIndex = Math.floor(Math.random() * channel.users.length);
          channel.owner = channel.users[randomIndex];
          // console.log('new channel owner:', channel.owner.username);
          await this.channelRepository.save(channel);
          const obj = {
            username: user.username,
            newOwner: channel.owner,
            channelId: channel.id,
          }
          this.eventEmmiter.emit('onChannelLeaveOwner', obj);
        }
        else {
          throw new BadRequestException("Owner cannot leave channel");
        }
      }
      else {
        channel.users = channel.users.filter((usr) => usr.id !== user.id);
        await this.channelRepository.save(channel);
        const obj = {
          username: user.username,
          channelId: channel.id,
        }
        this.eventEmmiter.emit('onChannelLeave', obj);
      }
      return (true);
    }

    async findOne(channelId: number)
    {
        return await this.channelRepository.findOne
        (
            { 
                where: {id: channelId },
                relations: {users:true}
            }
        );
    }

    async findAll() {
        const channel = await this.channelRepository.find(
            {
                relations: {
                    users: true,
                    owner: true,
                    messages: true,
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
      console.log('setPasswordToChannel (back)', channelPassword);
        const channel = await this.findOne(channelPassword.channelId);
        if (!channel) return (false);
        if (channelPassword.newPassword.length === 0) {
          await this.channelRepository.update({
            id: channelPassword.channelId},
            {
                password: channelPassword.newPassword,
                mode: 'Public',
            });
        }
        else {
          await this.channelRepository.update({
               id: channelPassword.channelId},
               {
                   password: channelPassword.newPassword,
                   mode: 'Private'
           });
        }
        const newChannel = await this.findOne(channelPassword.channelId);
        if (channel.password === newChannel.password) return (false);
        const payload = {
          channelId: channelPassword.channelId,
          password: channelPassword.newPassword,
          mode: newChannel.mode,
        }
        this.eventEmmiter.emit('onSetChannelPassword', payload);
        return (true);
    }

    async addUserAsAdmin(channelRelation: ChannelUserDto)
    {
        const channel = await this.channelRepository.findOne({
        where: { id: channelRelation.idChannel },
        relations: {
            adminUsers: true,
        },
        })
        const admin = await this.userService.findOneById(channelRelation.idUser);
        if (!admin) return (admin);
        channel.adminUsers.push(admin);
        const payload = {
          channel: channel,
          user: admin
        }
        await this.channelRepository.save(channel);
        this.eventEmmiter.emit("addAdmin", payload);
        return (admin);
    }

    async addBannedUserToChannel(channelRelation: ChannelUserDto) {
      const channel = await this.channelRepository.findOne({
        where: {id: channelRelation.idChannel},
        relations: { bannedUsers: true}
      });
      const bannedUser = await this.userService.findOneById(channelRelation.idUser);
      if (!bannedUser) return (bannedUser);
      channel.bannedUsers.push(bannedUser);
      await this.channelRepository.save(channel);
      const payload = {
        channel: channel,
        user: bannedUser
      }
      this.eventEmmiter.emit("banUser", payload);
      return (bannedUser);
    }

    async removeUserAsAdmin(channelRelation: ChannelUserDto) {
        const request = await this.channelRepository.findOne({
          relations: {
            adminUsers: true,
          },
          where: { id: channelRelation.idChannel}
        });
    
        request.adminUsers = request.adminUsers.filter((user) => {
          return (user.id !== channelRelation.idUser)
        })
        const admin = await this.userService.findOneById(channelRelation.idUser);
        if (!admin) return (admin);
        await this.channelRepository.save(request);
        const payload = {
          channel: request,
          user: admin,
        }
        this.eventEmmiter.emit("removeAdmin", payload);
        return (admin);
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
        const channel = await this.findOne(relation.channelId);
        console.log('channel password', channel.password);
        console.log('password inputted', relation.oldPassword);
        if (channel.password === relation.oldPassword) return (true);
        return (false);
      }

      async getAllBannedUsersOfChannel(channelId: ChannelIdDto) {
        const request = await this.channelRepository.findOne({
          where: {id: channelId.idChannel},
          relations: {bannedUsers: true}
        });
        return (request.bannedUsers);
      }

}