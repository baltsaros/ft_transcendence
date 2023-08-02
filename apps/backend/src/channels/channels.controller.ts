// import { Controller, Post, Get, Body, UsePipes, ValidationPipe } from '@nestjs/common';
// import { get } from 'http';
// import { ChannelsService } from './channels.service';

// @Controller('channels')
// export class AddChannelController {
//     constructor(private readonly channelsService: ChannelsService) {}

//     @Post()
//     @UsePipes(new ValidationPipe())
//     async addChannel(@Body() channelId: string) {
//         // const {channelId} = body;
//         await this.channelsService.addChannel(channelId);

//         return {message: "Channel added successfully!"};
//     }

//     @Get()
//     async getter() {
//         return {message: "Channel added successfully!"};
//     }
// }

import { Controller, Get } from '@nestjs/common';
import { ChannelsService } from './channels.service';


@Controller('channels')
export class ChannelController {
  constructor(private readonly channelsService: ChannelsService) {}
  
  @Get()
    getter() {
      console.log("request");
      const response = this.channelsService.getter();
      return response;
    }
}
