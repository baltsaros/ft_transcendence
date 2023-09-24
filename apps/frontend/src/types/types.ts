import { Socket } from 'socket.io-client'

export interface ISocketService {
  socket: Socket
}

export interface IUser {
  id: number;
  intraId: number;
  username: string;
  email: string;
  avatar: string;
  intraToken: string;
}

export interface IUserData {
  username: string;
  email: string;
  avatar: string;
  intraToken: string;
}

export interface IUserUsername {
  username: string;
  status: string;
}

export interface IResponseUser {
  id: number;
  intraId: number;
  username: string;
  email: string;
  intraToken: string;
  authentication: boolean;
  rank: number;
  avatar: string;

  // @ManyToMany(() => User)
  // @JoinTable()
  // friends: User[];
  status: string;
  // Change later
  // @OneToMany()
  // history: History[];

  // @ManyToMany(() => User)
  // @JoinTable()
  // blocked: User[];
  wins: number;
  loses: number;
  createdAt: Date;
}
/*
export interface IUserWithStatus {
  username: string;
  id: number;
  status: string;
}
*/
//Interface for the playerProfile
export interface IUserPlayerProfileData {
  username: string | undefined;
  wins: number | undefined;
  loses: number | undefined;
  rank: number | undefined;
  // @OneToMany(() => IMatch)
  // @JoinTable()
  // matches: IMatch[];
}

export interface IResponseUserData {
  token: string;
  user: IResponseUser;
}

export interface IMatch {
  id: number;

  scoreUser: number;
  scoreOpponent: number;
 // @OneToOne(() => User)
  // @JoinTable()
  // opponent: User;
  opponent: IUserUsername;
  user: IUserUsername;
}

export interface IMatchData {
  username: string,
  opponent: string,
  scoreUser: number,
  scoreOpponent: number
}

export interface IChannelData {
  name: string;
  mode: string;
  owner: IUser;
  password: string;
}

export interface IResponseChannelData {
  name: string;
  mode: string;
  owner: IUser;
  password: string;
  id: number;
}

export interface IGetChannels {
  username: string;
}

export interface IChannel {
  name: string,
  id: number,
}

export interface IResponseGetChannels {
  channels: IChannel[],
}

export interface IMessage {
  channelId: number | undefined,
  username: string | undefined,
  content: string,
}

export interface IFriendRelation {
  idUser: number;
  idFriend: number;
}
export interface IResponseMessage {
  content: string,
  user: IUser,
  channel: IResponseChannelData,
  id: number
}
