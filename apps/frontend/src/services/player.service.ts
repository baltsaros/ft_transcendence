import { instance } from "../api/axios.api";
import {  IFriendRelation, IUser, IUserPlayerProfileData, IUserUsername } from "../types/types";

export const PlayerService = {

  async getProfile(username: string): Promise<IUserPlayerProfileData | undefined> {
    const { data } = await instance.get<IUserPlayerProfileData>("user/" + username);
    if (data) return data;
  },

  async getAllFriends(id: string): Promise<IUserUsername[]> {
    const { data } = await instance.post<IUserUsername[]>("user/getFriends/" + id);
    if (data) return (data);
    return ([]);
  },

  async getInfoUser(username: string): Promise<number>{
    const { data } = await instance.get<IUser>("user/" + username);
    if (data) return (data.id);
    return (0);
  },

  async getAllOnlineUsers(): Promise<IUserUsername[]> {
    const { data } = await instance.post<IUserUsername[]>("user/online");
    if (data) return (data);
    return ([]);
  },

  async getAllOfflineUsers(): Promise<IUserUsername[]> {
    const { data } = await instance.post<IUserUsername[]>("user/offline");
    if (data) return (data);
    return ([]);
  },

  async removeFriend(friendRealtion: IFriendRelation) {
    const { data } = await instance.post("user/removeFriend", friendRealtion);
    if (data) return (true);
    return (false);
  },

  async getAllInvitations(id: string): Promise<IUserUsername[] | undefined> {
    const { data } = await instance.post<IUserUsername[]>("user/getInvitations/" + id);
    if (data) return (data);
  }
};