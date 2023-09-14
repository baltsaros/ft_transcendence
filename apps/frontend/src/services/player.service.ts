import { instance } from "../api/axios.api";
import {  IResponseUser, IUserPlayerProfileData, IUserWithStatus } from "../types/types";

export const PlayerService = {

  async getProfile(username: string): Promise<IUserPlayerProfileData | undefined> {
    const { data } = await instance.get<IUserPlayerProfileData>("user/" + username);
    if (data) return data;
  },

  async getAllUsers(): Promise<IUserWithStatus[] | undefined> {
    const { data } = await instance.get<IUserWithStatus[]>("user/");
    if (data) return data;
  }
};
