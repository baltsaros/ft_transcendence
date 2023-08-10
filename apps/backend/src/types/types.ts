
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
  status: boolean;
  message: string;
}
