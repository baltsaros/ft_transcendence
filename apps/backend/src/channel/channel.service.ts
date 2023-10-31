import {
  Injectable,
  BadRequestException,
  NotImplementedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Channel } from "./channel.entity";
import { IChannelsData, IChannelDmData } from "src/types/types";
import { UserService } from "../user/user.service";
import { ChannelUserDto } from "./dto/channelUser.dto";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ChannelPasswordDto } from "./dto/channelPassword.dto";
import { ChannelIdDto } from "./dto/channelIdDto.dto";

@Injectable() // Injectable decorator allows to inject the service into other Nestjs components like controllers, other services..
export class ChannelService {
  constructor(
    // ChannelService constructor
    @InjectRepository(Channel) // dependency injection of a TypeORM repository, used to inject a rep. of a specific entity (here channels)
    private readonly channelRepository: Repository<Channel>, // perform CRUD operations on the entity
    private readonly userService: UserService,
    private eventEmmiter: EventEmitter2
  ) {}
  async createChannel(channelData: IChannelsData) {
    const user = await this.userService.findOne(channelData.owner.username);
    const existingChannel = await this.channelRepository.findOne({
      where: { name: channelData.name },
    });
    if (existingChannel) {
      return undefined;
    }
    const newChannel = this.channelRepository.create({
      name: channelData.name,
      mode: channelData.mode,
      owner: user,
      password: channelData.password,
      users: [user],
      messages: [],
      dm: false,
    });
    const channel = await this.channelRepository.save(newChannel);
    console.log('here');
    this.eventEmmiter.emit("newChannel", channel);
    return channel;
  }

  async createDmChannel(channelDmData: IChannelDmData) {
    const sender = await this.userService.findOneById(channelDmData.sender);
    const existingChannel = await this.channelRepository.findOne({
      where: { name: channelDmData.name },
    });
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
      messages: [],
      dm: true,
    });
    const dmChannel = await this.channelRepository.save(newDmChannel);
    // console.log('dmChannel', dmChannel);
    this.eventEmmiter.emit("onNewDmChannel", dmChannel);
    return dmChannel;
  }

  async leaveChannel(payload: any) {
    const channel = await this.channelRepository.findOne({
      where: {
        id: payload.channelId,
      },
      relations: {
        users: true,
        owner: true,
        adminUsers: true,
      },
    });
    const user = await this.userService.findOne(payload.username);
    if (user.id === channel.owner.id) {
      if (channel.adminUsers.length > 0) {
        channel.users = channel.users.filter((usr) => usr.id !== user.id);
        const randomIndex = Math.floor(Math.random() * channel.adminUsers.length);
        channel.owner = channel.adminUsers[randomIndex];
        await this.channelRepository.save(channel);
        const obj = {
          username: user.username,
          newOwner: channel.owner,
          channelId: channel.id,
        };
        this.eventEmmiter.emit("onChannelLeaveOwner", obj);
      } else {
        throw new BadRequestException("Owner cannot leave channel");
      }
    } else {
      channel.users = channel.users.filter((usr) => usr.id !== user.id);
      await this.channelRepository.save(channel);
      const obj = {
        username: user.username,
        channelId: channel.id,
      };
      this.eventEmmiter.emit("onChannelLeave", obj);
    }
    return true;
  }

  async findOne(channelId: number) {
    return await this.channelRepository.findOne({
      where: { id: channelId },
      relations: { users: true },
    });
  }

    async findAll() {
      const channel = await this.channelRepository.find(
          {
            order: {
              messages: {
                id: "ASC"
              }
            },
              relations: {
                  users: true,
                  owner: true,
                  messages: true,
                  banned: true,
              }
          }
      );
      return channel;
  }

  async fetchMessage(id: number) {
    const channelMessage = await this.channelRepository.findOne({
      where: { id: id },
      relations: ["messages", "messages.user"],
    });
    return channelMessage;
  }

  async getHashedPass(channelId: string) {
    const channel = await this.channelRepository.findOne({
      where: { id: parseInt(channelId) },
    });
    if (!channel)
      throw new NotImplementedException("Could not find the channel by its id");
    return { hashed: channel.password };
  }

  async kickMemberOfChannel(relation: ChannelUserDto) {
    const request = await this.channelRepository.findOne({
      relations: {
        users: true,
      },
      where: { id: relation.idChannel },
    });

    request.users = request.users.filter((user) => {
      return user.id !== relation.idUser;
    });
    const channel = await this.channelRepository.save(request);
    if (channel) return true;
    return false;
  }

  async setPasswordToChannel(channelPassword: ChannelPasswordDto) {
    const channel = await this.findOne(channelPassword.channelId);
    if (!channel) return false;
    if (channelPassword.password.length === 0) {
      await this.channelRepository.update(
        {
          id: channelPassword.channelId,
        },
        {
          password: channelPassword.password,
          mode: "Public",
        }
      );
    } else {
      await this.channelRepository.update(
        {
          id: channelPassword.channelId,
        },
        {
          password: channelPassword.password,
          mode: "Private",
        }
      );
    }
    const newChannel = await this.findOne(channelPassword.channelId);
    if (channel.password === newChannel.password) return false;
    const payload = {
      channelId: channelPassword.channelId,
      password: channelPassword.password,
      mode: newChannel.mode,
    };
    this.eventEmmiter.emit("onSetChannelPassword", payload);
    return true;
  }

  async addUserAsAdmin(channelRelation: ChannelUserDto) {
    const channel = await this.channelRepository.findOne({
      where: { id: channelRelation.idChannel },
      relations: {
        adminUsers: true,
      },
    });
    const admin = await this.userService.findOneById(channelRelation.idUser);
    if (!admin) return admin;
    channel.adminUsers.push(admin);
    const payload = {
      channel: channel,
      user: admin,
    };
    await this.channelRepository.save(channel);
    this.eventEmmiter.emit("addAdmin", payload);
    return admin;
  }

  async addBannedUserToChannel(channelRelation: ChannelUserDto) {
    const channel = await this.channelRepository.findOne({
      where: { id: channelRelation.idChannel },
      relations: { banned: true },
    });
    const bannedUser = await this.userService.findOneById(
      channelRelation.idUser
    );
    if (!bannedUser) return bannedUser;
    channel.banned.push(bannedUser);
    await this.channelRepository.save(channel);
    const payload = {
      channel: channel,
      user: bannedUser,
    };
    this.eventEmmiter.emit("banUser", payload);
    return bannedUser;
  }

  async removeUserAsAdmin(channelRelation: ChannelUserDto) {
    const request = await this.channelRepository.findOne({
      relations: {
        adminUsers: true,
      },
      where: { id: channelRelation.idChannel },
    });

    request.adminUsers = request.adminUsers.filter((user) => {
      return user.id !== channelRelation.idUser;
    });
    const admin = await this.userService.findOneById(channelRelation.idUser);
    if (!admin) return admin;
    await this.channelRepository.save(request);
    const payload = {
      channel: request,
      user: admin,
    };
    this.eventEmmiter.emit("removeAdmin", payload);
    return admin;
  }

  async getAllAdminsOfChannel(channelId: ChannelIdDto) {
    const request = await this.channelRepository.findOne({
      relations: {
        adminUsers: true,
      },
      where: { id: channelId.idChannel },
    });

    return request.adminUsers;
  }

  async getAllBannedUsersOfChannel(channelId: ChannelIdDto) {
    const request = await this.channelRepository.findOne({
      where: { id: channelId.idChannel },
      relations: { banned: true },
    });
    return request.banned;
  }

  async getAllMutedUsersOfChannel(channelId: ChannelIdDto) {
    const request = await this.channelRepository.findOne({
      where: { id: channelId.idChannel },
      relations: { mutedUsers: true },
    });
    return request.mutedUsers;
  }

  async addMutedUserToChannel(channelRelation: ChannelUserDto) {
    const channel = await this.channelRepository.findOne({
      where: { id: channelRelation.idChannel },
      relations: { mutedUsers: true },
    });
    const mutedUser = await this.userService.findOneById(
      channelRelation.idUser
    );
    if (!mutedUser) return mutedUser;
    channel.mutedUsers.push(mutedUser);
    await this.channelRepository.save(channel);
    const payload = {
      channel: channel,
      user: mutedUser,
    };
    this.eventEmmiter.emit("muteUser", payload);
    return mutedUser;
  }

  async removeMutedUserOfChannel(channelRelation: ChannelUserDto) {
    const request = await this.channelRepository.findOne({
      relations: {
        mutedUsers: true,
      },
      where: { id: channelRelation.idChannel },
    });

    request.mutedUsers = request.mutedUsers.filter((user) => {
      return user.id !== channelRelation.idUser;
    });
    const muted = await this.userService.findOneById(channelRelation.idUser);
    if (!muted) return muted;
    await this.channelRepository.save(request);
    const payload = {
      channel: request,
      user: muted,
    };
    this.eventEmmiter.emit("unmuteUser", payload);
    return muted;
  }
}
