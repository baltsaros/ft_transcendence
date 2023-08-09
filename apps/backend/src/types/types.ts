
import { Profile } from "passport-42"

export interface IUser {
  id: string;
  username: string;
  avatar: string;
  intraId: string;
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

export interface IResponseGetChannels {
  channels: string[];
}
