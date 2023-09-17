
import { Profile } from "passport-42"

export interface IUser {
  id: number;
  username: string;
  avatar: string;
  intraId: number;
  email: string;
  intraToken: string;
}

export type Done = (err: Error, profile: Profile) => void;

export interface IChannelsData {
  name: string;
  mode: string;
  owner: IUser;
  password: string,
}

export interface IResponseChannelData {
  channel: IChannelsData
}

export interface IGetChannels {
  username: string;
}

export interface IChannel {
  name: string,
  id: number,
}

export interface IResponseGetChannels {
  channels: IChannel[];
}

