
import { Socket } from "socket.io"
import { Profile } from "passport-42"

export interface IUser {
  id: number;
  username: string;
  avatar: string;
  intraId: number;
  email: string;
  intraToken: string;
}

export interface IResponseUser {
  id: number;
  intraId: number;
  username: string;
  email: string;
  intraToken: string;
  twoFactorAuth: boolean;
  secret: string;
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

export type Done = (err: Error, profile: Profile) => void;

export interface IChannelsData {
  name: string;
  mode: string;
  owner: IUser;
  password: string,
}

export interface IChannelDmData {
  name: string;
  mode: string;
  sender: number;
  receiver: string;
  password: string;
}

export interface IGetChannels {
  username: string;
}

export interface IChannel {
  id: number,
  mode: string,
  name: string,
  password: string,
  users: IUser[],
}

export interface IResponseGetChannels {
  channels: IChannel[];
}

export interface IUserSocket extends Socket {
  userId?: number
}

export interface IUserRelation {
  idReceiver: number;
  idSender: number;
}

export interface IUserUsername {
  username: string;
  status: string;
}

