import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, MessageBody, ConnectedSocket} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import { OnEvent } from '@nestjs/event-emitter';
import { GatewaySessionManager } from './gateway.session';
import { ChannelService } from 'src/channel/channel.service';
import { UserService } from 'src/user/user.service';
import { Channel } from 'src/channel/channel.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { IResponseUser, IUserSocket } from 'src/types/types';
import { UserRelationDto } from 'src/user/dto/user-relation.dto';
import { BadRequestException } from '@nestjs/common';
import { ChannelPasswordDto } from 'src/channel/dto/channelPassword.dto';

/* The handleConnection function typically takes a parameter that represents the client WebSocket connection that has been established. 
** The Socket type is provided by the socket.io library and represents a WebSocket connection between the server and a client
** It is called when a client successfully establishes a connection w. the ws server, typically when the webpage containing ws logis is loaded
*/
@WebSocketGateway({
	namespace: '/chat',
    cors: {
      // origin: ['http://localhost:5173'],
      origin: '*',
    },
  })

export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  constructor(
    // private readonly chatService: ChatService,
    @InjectRepository(Channel) private readonly channelRepository: Repository<Channel>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly gatewaySessionManager: GatewaySessionManager,
    private readonly channelService: ChannelService,
    private readonly userService: UserService,
  ) {}

  async handleConnection(client: Socket){
    // console.log('client:', client.id, client.handshake.query.username.toString());
    this.gatewaySessionManager.setSocket(client.handshake.query.username.toString(), client);
    const username = client.handshake.query.username.toString();
    const channel = await this.channelService.findAll();
    const filteredChannel = channel.filter((channel) =>
      channel.users.some((user) =>
      user.username === username)
    )
    // 2. Make him join each room.
    filteredChannel.forEach((channel) => {
      client.join(`channel-${channel.id}`);
      // console.log(client.id, client.rooms);
    });
  }

  handleDisconnect(client: Socket) {
    this.gatewaySessionManager.removeSocket(client.handshake.query.username.toString())
  }

  @OnEvent('newChannel')
  handleNewChannel(payload: any) {
    console.log('payload', payload.owner.username);
    const socket = this.gatewaySessionManager.getSocket(payload.owner.username);
    socket.join(`channel-${payload.id}`);
    console.log('user joined:', `channel-${payload.id}`);
    console.log('socket.rooms @ creation:', socket.rooms);
    const userMapping: Map<string, IUserSocket> = this.gatewaySessionManager.getUserMapping();
      userMapping.forEach((socket) => {
        socket.emit('newChannelCreated', payload);
      } )
  }

  @SubscribeMessage('updateStatus')
  handleUpdateStatus(@MessageBody("data") data: {userUpdate: IResponseUser}) {
    this.server.emit('newUpdateStatus', data.userUpdate);
  }

  @OnEvent('messageCreated')
  handleMessage(payload: any) {
    // 1. Emit message event to memeber of socket.io room
    console.log('channel id gateway:', payload.channel.id);
    const socket = this.gatewaySessionManager.getSocket(payload.user.username);
    this.server.to(`channel-${payload.channel.id}`).emit('onMessage', payload);
  }

  @OnEvent('onSetChannelPassword')
  handleSetChannelPassword(payload: ChannelPasswordDto) {
    console.log('gateway payload', payload);
    // 1. Redux: channel id + password
    // 2. emit event to all clients
    console.log('event emitted');
    this.server.emit('setChannelPassword', payload);
  }

  @OnEvent('blockUser')
  async handleBlockUser(payload: UserRelationDto) {
    const blocked = await this.userRepository.findOne({
      where: {id: payload.receiverId},
    });
    // console.log('blocked', blocked.username);
    const username = blocked.username;
    const status = blocked.status;
    const reduxPayload = {
      username,
      status,
    }
    const sender = await this.userRepository.findOne({
      where: {id: payload.senderId},
    });
    console.log('sender', sender.username);
    const socket = this.gatewaySessionManager.getSocket(sender.username);
    socket.emit('userBlocked', reduxPayload);
  }

  @OnEvent('unblockUser')
  async handleUnblockUser(payload: UserRelationDto) {
    const blocked = await this.userRepository.findOne({
      where: {id: payload.receiverId},
    });
    const username = blocked.username;
    const status = blocked.status;
    const reduxPayload = {
      username,
      status,
    }
    const sender = await this.userRepository.findOne({
      where: {id: payload.senderId},
    });
    const socket = this.gatewaySessionManager.getSocket(sender.username);
    socket.emit('userUnblocked', reduxPayload);
  }

  @OnEvent('onChannelLeave')
  async handleChanneLeave(payload: any) {
    console.log('payload', payload);
    // 1. Emit an event to the all clients to update the users array in the redux state
    const client = this.gatewaySessionManager.getSocket(payload.username);
    // this.server.to(payload.channelId).emit('userLeft', payload);
    console.log('before leaving room', client.id, client.rooms);
    // client.to(`channel-${payload.channelId}`).emit('userLeft', payload);
    this.server.to(`channel-${payload.channelId}`).emit('userLeft', payload);
    client.leave(`channel-${payload.channelId}`);
    console.log('after leaving room', client.id, client.rooms);
    console.log('userLeft event emitted:', payload);
  }

  @OnEvent('onChannelLeaveOwner')
  async handleChannelLeaveOwner(payload: any) {
    // 1. Emit an event to all clients of the channel w. 
    const client = this.gatewaySessionManager.getSocket(payload.username);
    console.log('before leaving room', client.id, client.rooms);
    // this.server.emit('ownerLeft', payload);
    this.server.to(`channel-${payload.channelId}`).emit('ownerLeft', payload);
    client.leave(`channel-${payload.channelId}`);
    console.log('after leaving room', client.id, client.rooms);
    console.log('onChannelLeaveOwner');
  }
  
  @SubscribeMessage('onNewDmChannel')
  async onNewDmChannel(client: Socket, payload: any) {
    const dmChannel = await this.channelRepository.findOne({
      where: {
        id: payload.id,
      },
      relations: {
        users: true,
      },
    });
    payload.user.forEach((username) => {
      const socket = this.gatewaySessionManager.getSocket(username);
      if (socket) {
        // console.log('client:', username, 'joined:', socket.id, payload.id);
        // socket.join(payload.id);
        socket.join(`channel-${payload.id}`);
      }
    });
    console.log(payload);
    this.server.to(payload.id).emit('DmChannelJoined', dmChannel);
  }
    
  /* any should be specified */
  @SubscribeMessage('onChannelJoin')
  async onChannelJoin(client: Socket, payload: any) {
    try{
      console.log('payload', payload);
      const channel = await this.channelRepository.findOne({
        where: {
          id: payload.channelId,
        },
        relations: {
          users: true,
        },
      })
      if (channel.mode === 'Private') {
        console.log('client pswd:', payload.password);
        const channel = await this.channelRepository.findOne({
          where: {
            id: payload.channelId,
          },
          relations: {
            users: true,
          },
        })
        console.log('payload pswd', payload.password);
        console.log('channle pswd', channel.password);
        if (payload.password != channel.password) {
          console.log('error event emitted');
          client.emit('userJoinedError', 'Wrong password');
          return;
        }
      }
      const user = await this.userService.findOne(payload.username); 
      channel.users.push(user);
      await this.channelRepository.save(channel);
      const channelId = channel.id;
      const value = {
        channelId,
        user,
      };
      client.join(`channel-${payload.channelId}`);
      this.server.to(`channel-${payload.channelId}`).emit('userJoined', value);
      console.log('userJoined event emitted');

    }catch (error){
      console.log("error joining channel");
    }
  }
}