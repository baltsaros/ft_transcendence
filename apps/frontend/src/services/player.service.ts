import { instance } from "../api/axios.api";
import { IUserPlayerProfileData } from "../types/types";

export const PlayerService = {

  async getProfile(username: string): Promise<IUserPlayerProfileData | undefined> {
    const { data } = await instance.get<IUserPlayerProfileData>("user/" + username);
    if (data) return data;
  },

};