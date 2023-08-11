import { Controller, Post, Get, Body, Param, Query} from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { IAddChannelsData, IResponseAddChannelData, IGetChannels } from 'src/types/types';


@Controller('channels')
export class AddChannelController {
    constructor(private readonly channelsService: ChannelsService) {}

    @Post()
    async addChannel(@Body() channelData: IAddChannelsData): Promise<IResponseAddChannelData> {
        return await this.channelsService.addChannel(channelData);
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