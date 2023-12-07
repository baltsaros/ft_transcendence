import { instance } from "../api/axios.api";
import {  IUserRelation, IUser, IUserPlayerProfileData, IUserUsername, IResponseUser } from "../types/types";

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
    return data;
  },

  async updateElo(player: IResponseUser)
  {
    const { data } = await instance.post("user/updateElo", player);
    if (data) return (true);
    return
  },

  async refuseInvitation(invitation: IUserRelation)
  {
    const { data } = await instance.post("user/refuseInvitation", invitation);
    if (data) return (true);
    return (false);
  },

  async sendInvitation(friendRelation: IUserRelation)
  {
    const data = await instance.post("user/sendInvitation", friendRelation);
    return (data);
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
    return (data);
  },

  async getAllBlocked(id: number): Promise<IUserUsername[]> {
    const payload = {
      id : id, 
    }
    const blocked = await instance.post<IUserUsername[]>("user/getAllBlocked", payload);
    if (blocked) return (blocked.data);
    return ([]); 
  },

  async getFriend(friendRelation: IUserRelation)
  {
    const { data } = await instance.post("user/getFriend", friendRelation);
    return (data);
  },

  async unblockUser(blockRelation: IUserRelation)
  {
    const { data } = await instance.post("user/unblockUser", blockRelation);
    if (data)
      return (true);
    return (false);
  },

  async getFullUser(username: string) {
    const { data } = await instance.get("user/" + username);
    return (data);
  }
};

