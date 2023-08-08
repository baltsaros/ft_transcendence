import { Controller, Post, Get, Body, Param, Query} from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { IAddChannelsData, IResponseAddChannelData, IGetChannels } from 'src/types/types';


@Controller('channels')
export class AddChannelController {
    constructor(private readonly channelsService: ChannelsService) {}

    @Post()
    async addChannel(@Body() channelData: IAddChannelsData): Promise<IResponseAddChannelData> {
        await this.channelsService.addChannel(channelData);

        const response: IResponseAddChannelData = {
          status: true,
          message: "Channel successfully created",
        };
        console.log(response.message);
        return (response);
    }

    @Get()
    // async getChannel(@Param('username') data: string) {
    async getChannel(@Query() data: IGetChannels ) {
        const name = data.username;
        return await (this.channelsService.getChannel(name))
    }
}