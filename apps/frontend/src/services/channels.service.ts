import { instance } from "../api/axios.api";
import { IChannelPassword, IChannelRelation, IResponseChannelData, IUser } from "../types/types";

export const ChannelService = {

    async kickMemberOfChannel(relation: IChannelRelation): Promise<boolean> {
        const { data } = await instance.post("channel/kickMemberOfChannel", relation);
        if (data) return (true);
        return (false);
      },

    async getOwnerOfChannel(idChannel: number) {
        const { data } = await instance.get<IResponseChannelData>("channel/" + idChannel);
        if (data) return (data.owner.id);
        return (0);
    },

    async setPasswordToChannel(channelPassword: IChannelPassword) {
        console.log('setPasswordToChannel (front)');
        const { data } = await instance.patch<Boolean>("channel/setPassword/", channelPassword);
        return (data);
    },

    async removePasswordOfChannel(idChannel: number) {
        const channelPassword = {
            idChannel,
            password: "",
        }
        return (this.setPasswordToChannel(channelPassword));
    },

    async addUserAsAdmin(channelRelation: IChannelRelation) {
        const { data } = await instance.post<IUser>("channel/addUserAsAdmin/", channelRelation);
        return (data);
    },

    async removeUserAsAdmin(channelRelation: IChannelRelation) {
        const { data } = await instance.post<IUser>("channel/removeUserAsAdmin/", channelRelation);
        return (data);
    },

    async getAllAdminsOfChannel(channelId: number) {
        const { data } = await instance.post<IUser[]>("channel/getAllAdminsOfChannel/", {channelId});
        if (data) return data;
        return ([]);
    },

    async checkIfSamePassword(channelPassword: IChannelPassword) {
        const { data } = await instance.post<Boolean>("channel/checkIfSamePassword/", channelPassword);
        return (data);
    },

    async getAllBannedUsersOfChannel(channelId: number) {
        const { data } = await instance.post<IUser[]>("channel/getAllBannedUsersOfChannel/", {channelId});
        return (data);
    },

    async addUserBannedToChannel(channelRelation: IChannelRelation) {
        const { data } = await instance.post<IUser>("channel/addBannedUserToChannel/", channelRelation);
        return (data);
    },
    
    async getHashedPassword(channelId: number) {
        const { data } = await instance.get("channel/getPass/" + channelId.toString());
        console.log(data.data);
        return (data);
    }
};
