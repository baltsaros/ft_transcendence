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
import { IUserSocket } from 'src/types/types';
import { UserRelationDto } from 'src/user/dto/user-relation.dto';
import { send } from 'process';

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
      client.join(channel.id.toString())
      // console.log("client joined:", client.id, channel.name);
    });
  }

  handleDisconnect(client: any) {
    this.gatewaySessionManager.removeSocket(client.handshake.query.username.toString())
  }

  @OnEvent('newChannel')
  handleNewChannel(payload: any) {
    const userMapping: Map<string, IUserSocket> = this.gatewaySessionManager.getUserMapping();
      userMapping.forEach((socket) => {
        socket.emit('newChannelCreated', payload);
      } )
  }

  @OnEvent('message.created')
  handleMessage(payload: any) {
    this.server.emit('onMessage', {
      content: payload.content,
      user: payload.user,
      id: payload.id,
      channel: payload.channel
    });
  }

  @OnEvent('blockUser')
  async handleBlockUser(payload: UserRelationDto) {
    const blocked = await this.userRepository.findOne({
      where: {id: payload.receiverId},
    });
    console.log('blocked', blocked.username);
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

  @OnEvent('onChannelLeave')
  async handleChanneLeave(payload: any) {
    // 1. Emit an event to the all clients to update the users array in the redux state
    // and also update the owner object (if it was changed ?). So I need IResponsUser x 2
    this.server.to(payload.channelId).emit('userLeft', payload);
    // client.leave(payload.channelId);
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
        socket.join(payload.id);
      }
    });
    this.server.to(payload.id).emit('DmChannelJoined', dmChannel);
  }
    
  /* any should be specified */
  @SubscribeMessage('onChannelJoin')
  async onChannelJoin(client: Socket, payload: any) {
    try{
      const channel = await this.channelRepository.findOne({
        where: {
          id: payload.channelId,
        },
        relations: {
          users: true,
        },
      })
      const user = await this.userService.findOne(payload.username); 
      channel.users.push(user);
      await this.channelRepository.save(channel);
      const channelId = channel.id;
      const value = {
        channelId,
        user,
      };
      client.join(payload.channelId);
      this.server.to(payload.channelId).emit('userJoined', value);

    }catch (error){
      console.log("error joining channel");
    }
  }

  @SubscribeMessage('onChannelLeave')
  async onChannelLeave(client: Socket, payload: any) {
    try{
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
      console.log('user:', user.id);
      console.log('channel owner:', channel.owner.id);
      if (user.id === channel.owner.id) {
        // 1. check if there are users in the channel, if not prevent owner from leaving the channel
        console.log('users in the channel:', channel.users.length);
        if (channel.users.length <= 1) {

        }
        // 1. remove the owner
        console.log('owner is leaving the channel');
        // 2. set new owner

      }
      channel.users = channel.users.filter((usr) => usr.id !== user.id);
      await this.channelRepository.save(channel);
      this.server.to(payload.channelId).emit('userLeft', payload);
      client.leave(payload.channelId);
    }catch (error) {
      console.log('error leaving channel', error);
    }
  }
}