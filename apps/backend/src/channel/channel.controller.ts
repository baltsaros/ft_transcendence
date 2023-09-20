import { Controller, Post, Get, Body, Param, Query} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { IChannelsData, IGetChannels } from 'src/types/types';


@Controller('channel')
export class ChannelController {
    constructor(private readonly ChannelService: ChannelService) {}

    @Post()
    async addChannel(@Body() channelData: IChannelsData) {
        return await this.ChannelService.createChannel(channelData);
    }

    @Get()
    // async getChannel(@Param('username') data: string) {
    async getChannel(@Query() data: IGetChannels ) {
        const name = data.username;
        return await (this.ChannelService.findAll(name))
    }

    @Get(':channelId')
    async getChannelById(@Param('channelId') channelId: number) {
        // console.log('channelId BE:', channelId)
        // return await this.ChannelService.getChannelById(channelId);
        return await this.ChannelService.getChannelById(channelId);
    }

}