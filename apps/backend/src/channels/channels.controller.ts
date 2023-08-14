import { Controller, Post, Get, Body, Param, Query} from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { IChannelsData, IResponseChannelData, IGetChannels } from 'src/types/types';


@Controller('channels')
export class ChannelController {
    constructor(private readonly channelsService: ChannelsService) {}

    @Post()
    async addChannel(@Body() channelData: IChannelsData): Promise<IResponseChannelData> {
        return await this.channelsService.createChannel(channelData);
    }

    @Get()
    // async getChannel(@Param('username') data: string) {
    async getChannel(@Query() data: IGetChannels ) {
        const name = data.username;
        return await (this.channelsService.getChannel(name))
    }

    @Get(':channelId')
    async getChannelById(@Param('channelId') channelId: number) {
        console.log('channelId BE:', channelId)
        return await this.channelsService.getChannelById(channelId);

    }

}