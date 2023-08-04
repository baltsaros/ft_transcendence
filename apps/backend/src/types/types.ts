export interface IUser {
  id: string;
  username: string;
  email: string;
}

export interface IAddChannelsData {
  name: string;
  mode: string;
}

export interface IResponseAddChannelData {
  status: boolean;
  message: string;
}
 
