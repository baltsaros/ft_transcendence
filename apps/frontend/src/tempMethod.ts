import { ChannelService } from "./services/channels.service";
import { IChannelRelation } from "./types/types";

const kickUser = async (relation: IChannelRelation) => {
    try {
        const ownerOfChannel = await ChannelService.getOwnerOfChannel(relation.idChannel);
        console.log('id owner = ', ownerOfChannel);
        const ok = await ChannelService.kickMemberOfChannel({idChannel: 1, idUser: 1});
        console.log(ok);     
     } catch (err: any) {}}