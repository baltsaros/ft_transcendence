import { Controller, Post, Get, Body} from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { IAddChannelsData, IResponseAddChannelData } from 'src/types/types';


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
    async getter() {
        return {message: "Channel added successfully!"};
    }
}