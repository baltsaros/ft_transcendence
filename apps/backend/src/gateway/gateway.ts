import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, MessageBody, ConnectedSocket} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import { newMessageDto } from 'src/channel/message/new-message.dto';
import { GatewayService } from './gateway.service'
import { OnEvent } from '@nestjs/event-emitter';
import { GatewaySessionManager } from './gateway.session';
import { ChannelService } from 'src/channel/channel.service';
import { UserService } from 'src/user/user.service';
import { Channel } from 'src/channel/channel.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';



/* The handleConnection function typically takes a parameter that represents the client WebSocket connection that has been established. 
** The Socket type is provided by the socket.io library and represents a WebSocket connection between the server and a client
** It is called when a client successfully establishes a connection w. the ws server, typically when the webpage containing ws logis is loaded
*/
@WebSocketGateway({
    cors: {
      // origin: ['http://localhost:5173'],
      origin: '*',
    },
  })

export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server
  constructor(
    // private readonly chatService: ChatService,
    @InjectRepository(Channel) private readonly channelRepository: Repository<Channel>,
    private readonly gatewaySessionManager: GatewaySessionManager,
    private readonly channelService: ChannelService,
    private readonly userService: UserService,
  ) {}

  handleConnection(client: Socket){
    console.log(client.id);
    // this.gatewaySessionManager.setSocket(client.handshake.query.username.toString(), client)
  }

  handleDisconnect(client: any) {
    // this.gatewaySessionManager.removeSocket(client.handshake.query.username.toString())
  }

  @OnEvent('message.created')
  handleMessage(payload: any) {
    // console.log('Message received from:', payload.user);
    // console.log('Message received from:', payload.channel);
    this.server.to(payload.channel.id).emit('onMessage', {
      content: payload.content,
      user: payload.user,
      id: payload.id,
      channel: payload.channel
    });
    // this.server.emit('onMessage', {
    //   content: payload.content,
    //   user: payload.user,
    //   id: payload.id,
    //   channel: payload.channel
    // });
  }

  @OnEvent('channel.created')
  handleNewChannel(payload: any) {
    console.log('channel created event:', payload);
    this.server.emit('newChannel', payload); // payload is not in line w. state of Redux slice
    // Update the channel - user mapping
    // Emit event to all users
  }

  /* any should be specified */
  @SubscribeMessage('onChannelJoin')
  async onChannelJoin(client: Socket, payload: any) {
    console.log('client', client.id);
    console.log('payload', payload);
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
      // console.log('channel fetched:' , channel);
      // console.log('user fetched:' , user);
      channel.users.push(user);
      await this.channelRepository.save(channel);
      // console.log('channel after push:' , channel);
      client.join(payload.channelId);
      this.server.to(payload.channelId).emit('userJoined', payload);
      // client.emit('userJoined', payload);

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
        },
      })
      const user = await this.userService.findOne(payload.username);
      channel.users = channel.users.filter((u) => u.id !== user.id);
      await this.channelRepository.save(channel);
      console.log('channel user:', channel.users);
      client.leave(payload.channelId);
      client.to(payload.channelId).emit('userLeft', payload);
    }catch (error) {
      console.log('error leaving channel')
    }
  }
}