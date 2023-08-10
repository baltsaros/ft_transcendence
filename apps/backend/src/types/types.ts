
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

export interface IAddChannelsData {
  name: string;
  mode: string;
  owner: string;
  password: string,
}

export interface IResponseAddChannelData {
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
  channels: IChannel[];
}
