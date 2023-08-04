export interface IUser {
  id: string;
  username: string;
  email: string;
}

export interface IAddChannelsData {
  channelId: string;
  // name: string;
}

export interface IResponseAddChannelData {
  status: boolean;
  message: string;
}
 
