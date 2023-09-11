import { instance } from "../api/axios.api";
import { IMatch, IMatchData } from "../types/types";

export const MatchService = {

  async getAllMatchForPlayer(username: string): Promise<IMatch[] | undefined> {
    // console.log("matches services " + username);
    const { data } = await instance.get<IMatch[]>("matches/" + username);
    if (data) return data;
  },

  async addMatch(matchData: IMatchData): Promise<IMatch | undefined> {
    const { data }  = await instance.post<IMatch>("matches", matchData);
    if (data) return (data);
  },

  async deleteAllMatches() {
    await instance.post("matches/clear");
  }

};