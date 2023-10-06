import { instance } from "../api/axios.api";
import {  IUserRelation, IUser, IUserPlayerProfileData, IUserUsername } from "../types/types";

export const PlayerService = {

  async getProfile(username: string): Promise<IUserPlayerProfileData | undefined> {
    const { data } = await instance.get<IUserPlayerProfileData>("user/" + username);
    if (data) return data;
  },

  async getAllFriends(id: number): Promise<IUserUsername[]> {
    const { data } = await instance.post<IUserUsername[]>("user/getFriends", {id});
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

  async removeFriend(friendRealtion: IUserRelation) {
    const { data } = await instance.post("user/removeFriend", friendRealtion);
    if (data) return (true);
    return (false);
  },

  async getAllInvitations(id: number): Promise<IUserUsername[] | undefined> {
    const { data } = await instance.post<IUserUsername[]>("user/getInvitations/", {id});
    if (data) return (data);
  },

  async acceptInvitation(invitation: IUserRelation)
  {
    const { data } = await instance.post("user/acceptInvitation", invitation);
    if (data) return (true);
    return (false);
  },


  async refuseInvitation(invitation: IUserRelation)
  {
    const { data } = await instance.post("user/refuseInvitation", invitation);
    if (data) return (true);
    return (false);
  },

  async sendInvitation(friendRelation: IUserRelation)
  {
    const { data } = await instance.post("user/sendInvitation", friendRelation);
    if (data) return (true);
    return (false);
  },

  async blockUser(friendRelation: IUserRelation)
  {
    const { data } = await instance.post("user/blockUser", friendRelation);
    if (data) return (true);
    return (false);
  },

  async getBlocked(friendRelation: IUserRelation)
  {
    const { data } = await instance.post("user/getBlocked", friendRelation);
    //console.log(data);
    //if (data) return (true);
    return (data);
  },

  async getFriend(friendRelation: IUserRelation)
  {
    const { data } = await instance.post("user/getFriend", friendRelation);
    //console.log(data);
    return (data);
  }
};

