import { instance } from "../api/axios.api";
import {  IUserPlayerProfileData, IUserUsername } from "../types/types";

export const PlayerService = {

  async getProfile(username: string): Promise<IUserPlayerProfileData | undefined> {
    const { data } = await instance.get<IUserPlayerProfileData>("user/" + username);
    if (data) return data;
  },

  async getAllFriends(id: string): Promise<IUserUsername[] | undefined> {
    const { data } = await instance.post<IUserUsername>("getFriends/" + id);
    if (data) return (data);
  },
};