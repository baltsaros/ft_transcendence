import { instance } from "../api/axios.api";
import { IChannelPassword, IChannelRelation, IResponseChannelData } from "../types/types";

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

    async setPasswordToChannel(data: IChannelPassword) {
    },

    async changePasswordOfChannel(data: IChannelPassword) {
    },

    async removePasswordOfChannel(data: IChannelPassword) {
    },

    async setUserAsAdmin(data: IChannelRelation) {
    },

    async getAllAdminsOfChannel(channelId: number) {
    }
    
};
