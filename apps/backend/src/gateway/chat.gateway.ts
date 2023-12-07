import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { OnEvent } from "@nestjs/event-emitter";
import { GatewaySessionManager } from "./gateway.session";
import { ChannelService } from "src/channel/channel.service";
import { UserService } from "src/user/user.service";
import { Channel } from "src/channel/channel.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";
import { IResponseUser, IUserSocket } from "src/types/types";
import { UserRelationDto } from "src/user/dto/user-relation.dto";
import { ChannelPasswordDto } from "src/channel/dto/channelPassword.dto";
import { ChannelUserObjectDto } from "src/channel/dto/channelUserObject.dto";

/* The handleConnection function typically takes a parameter that represents the client WebSocket connection that has been established.
 ** The Socket type is provided by the socket.io library and represents a WebSocket connection between the server and a client
 ** It is called when a client successfully establishes a connection w. the ws server, typically when the webpage containing ws logis is loaded
 */
@WebSocketGateway({
  namespace: "/chat",
  cors: {
    // origin: ['http://localhost:5173'],
    origin: "*",
  },
})

export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  constructor(
    // private readonly chatService: ChatService,
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly gatewaySessionManager: GatewaySessionManager,
    private readonly channelService: ChannelService,
    private readonly userService: UserService
  ) {}

  async handleConnection(client: Socket) {
    // console.log('client:', client.id, client.handshake.query.username.toString());
    this.gatewaySessionManager.setSocket(
      client.handshake.query.username.toString(),
      client
    );
    const username = client.handshake.query.username.toString();
    const channel = await this.channelService.findAll();
    const filteredChannel = channel.filter((channel) =>
      channel.users.some((user) => user.username === username)
    );
    filteredChannel.forEach((channel) => {
      client.join(`channel-${channel.id}`);
      // console.log(client.id, client.rooms);
    });
  }

  handleDisconnect(client: Socket) {
    this.gatewaySessionManager.removeSocket(
      client.handshake.query.username.toString()
    );
  }

  @OnEvent("newChannel")
  handleNewChannel(payload: any) {
    console.log("payload", payload.owner.username);
    const socket = this.gatewaySessionManager.getSocket(payload.owner.username);
    socket.join(`channel-${payload.id}`);
    console.log("user joined:", `channel-${payload.id}`);
    console.log("socket.rooms @ creation:", socket.rooms);
    const userMapping: Map<string, IUserSocket> =
      this.gatewaySessionManager.getUserMapping();
    userMapping.forEach((socket) => {
      socket.emit("newChannelCreated", payload);
    });
  }

  @OnEvent('onNewDmChannel')
  handleNewDmChannel(payload: any) {
    payload.users.forEach((user) => {
      const socket = this.gatewaySessionManager.getSocket(user.username);
      if (socket) {
        console.log('client:', user.username, 'joined:', socket.id, payload.id);
        socket.join(`channel-${payload.id}`);
      }
    });
    this.server.to(`channel-${payload.id}`).emit('DmChannelJoined', payload);
  }

  @SubscribeMessage('updateStatus')
  handleUpdateStatus(@MessageBody("data") data: {userUpdate: IResponseUser}) {
    this.server.emit('newUpdateStatus', data.userUpdate);
  }

  @OnEvent("messageCreated")
  handleMessage(payload: any) {
    this.server.to(`channel-${payload.channelId}`).emit('onMessage', payload);
  }

  @OnEvent("onSetChannelPassword")
  handleSetChannelPassword(payload: ChannelPasswordDto) {
    console.log("gateway payload", payload);
    // 1. Redux: channel id + password
    // 2. emit event to all clients
    console.log("event emitted");
    this.server.emit("setChannelPassword", payload);
  }

  @OnEvent("blockUser")
  async handleBlockUser(payload: UserRelationDto) {
    const blocked = await this.userRepository.findOne({
      where: { id: payload.receiverId },
    });
    const username = blocked.username;
    const status = blocked.status;
    const reduxPayload = {
      username,
      status,
    };
    const sender = await this.userRepository.findOne({
      where: { id: payload.senderId },
    });
    const socket = this.gatewaySessionManager.getSocket(sender.username);
    socket.emit("userBlocked", reduxPayload);
    socket.emit("userBlockedPlayer", reduxPayload);
  }

  @OnEvent("banUser")
  async handleBanUser(payload: ChannelUserObjectDto) {
    const socket = this.gatewaySessionManager.getSocket(payload.user.username);
    console.log('userBanned event emitted');
    const reduxPayload = {
      channelId: payload.channel.id,
      banned: payload.user,
    }
    this.server.emit("userBanned", reduxPayload);
  }

  @OnEvent("addAdmin")
  async handleAddAdmin(payload: ChannelUserObjectDto) {
    this.server.to(`channel-${payload.channel.id}`).emit("adminAdded", payload);
  }

  @OnEvent("removeAdmin")
  async handleRemoveAdmin(payload: ChannelUserObjectDto) {
    this.server
      .to(`channel-${payload.channel.id}`)
      .emit("adminRemoved", payload);
  }

  @OnEvent('muteUser')
  async handleMuteUser(payload: ChannelUserObjectDto) {
    this.server.to(`channel-${payload.channel.id}`).emit('userMuted', payload);
  }

  @OnEvent('unmuteUser')
  async handleUnmuteUser(payload: ChannelUserObjectDto) {
    this.server.to(`channel-${payload.channel.id}`).emit('userUnmuted', payload);
  }

  @OnEvent('unblockUser')
  async handleUnblockUser(payload: UserRelationDto) {
    const blocked = await this.userRepository.findOne({
      where: { id: payload.receiverId },
    });
    const username = blocked.username;
    const status = blocked.status;
    const reduxPayload = {
      username,
      status,
    };
    const sender = await this.userRepository.findOne({
      where: { id: payload.senderId },
    });
    const socket = this.gatewaySessionManager.getSocket(sender.username);
    socket.emit("userUnblocked", reduxPayload);
    socket.emit("userUnblockedPlayer", reduxPayload);
  }

  @OnEvent("onChannelLeave")
  async handleChanneLeave(payload: any) {
    console.log("onChannelLeave", payload);
    const client = this.gatewaySessionManager.getSocket(payload.username);
    this.server.to(`channel-${payload.channelId}`).emit("userLeft", payload);
    client.leave(`channel-${payload.channelId}`);
  }

  @OnEvent("onChannelLeaveOwner")
  async handleChannelLeaveOwner(payload: any) {
    const client = this.gatewaySessionManager.getSocket(payload.username);
    this.server.to(`channel-${payload.channelId}`).emit("ownerLeft", payload);
    client.leave(`channel-${payload.channelId}`);
    // console.log("after leaving room", client.id, client.rooms);
  }

  @OnEvent("removeFriend")
  handleRemoveFriend(@MessageBody("data") data: { users: IResponseUser[] }) {
    const socket1 = this.gatewaySessionManager.getSocket(
      data.users[0].username
    );
    const socket2 = this.gatewaySessionManager.getSocket(
      data.users[1].username
    );
    if (socket1 && socket2) {
      socket2.emit("requestRemoveFriend", {
        username: data.users[0].username,
        status: data.users[0].status,
      });
      socket1.emit("requestRemoveFriend", {
        username: data.users[1].username,
        status: data.users[1].status,
      });
    }
  }

  @OnEvent("addFriend")
  handleAddFriend(@MessageBody("data") data: { users: IResponseUser[] }) {
    const socket1 = this.gatewaySessionManager.getSocket(
      data.users[0].username
    );
    if (socket1) {
      socket1.emit("requestAddFriend", {
        username: data.users[1].username,
        status: data.users[1].status,
      });
    }
  }

  @OnEvent("addInvitation")
  handleAddInvitation(@MessageBody("data") data: any) {
    const socket = this.gatewaySessionManager.getSocket(data.socketUsername);
    if (socket) {
      socket.emit("requestAddInvitation", {
        username: data.username,
        status: data.status,
      });
    }
  }

  @SubscribeMessage("onChannelJoin")
  async onChannelJoin(client: Socket, payload: any) {
    try {
      console.log("payload", payload);
      const channel = await this.channelRepository.findOne({
        where: {
          id: payload.channelId,
        },
        relations: {
          users: true,
        },
      });
      const user = await this.userService.findOne(payload.username);
      channel.users.push(user);
      await this.channelRepository.save(channel);
      const channelId = channel.id;
      const value = {
        channelId,
        user,
      };
      client.join(`channel-${payload.channelId}`);
      this.server.to(`channel-${payload.channelId}`).emit("userJoined", value);
      console.log("userJoined event emitted");
    } catch (error) {
      console.log("error joining channel");
    }
  }

  @OnEvent("uploadUsername")
  async onUpdateUser(payload: any) {
    this.server.emit("usernameUpdatedChannel", payload);
    this.server.emit("usernameUpdatedProfile", payload);
    this.server.emit("usernameUpdatedHome", payload);
  }
}
