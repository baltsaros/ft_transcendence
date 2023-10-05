import { Controller, Post, Get, Body, Param, Query, UseGuards} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { IChannelsData, IGetChannels } from 'src/types/types';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ChannelUserDto } from './dto/channelUser.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ChannelPasswordDto } from './dto/channelPassword.dto';
import { ChannelIdDto } from './dto/channelIdDto.dto';


@Controller('channel')
export class ChannelController {
    constructor(
        private readonly ChannelService: ChannelService,
        private eventEmmiter: EventEmitter2
        ) {}

    @Post()
    async addChannel(@Body() channelData: IChannelsData) {
        const newChannel = await this.ChannelService.createChannel(channelData);
        return newChannel;
    }

    @Get()
    async getChannel() {
        return await (this.ChannelService.findAll());
    }
    // async getChannel(@Param('username') data: string) {
    // async getChannel(@Query() data: IGetChannels ) {
    //     const name = data.username;
    //     return await (this.ChannelService.findAll(name))
    // }

    @Get(':channelId')
    async getChannelById(@Param('channelId') channelId: number) {
        // console.log('channelId BE:', channelId)
        // return await this.ChannelService.getChannelById(channelId);
        return await this.ChannelService.getChannelById(channelId);
    }

    @Post('kickMemberOfChannel')
    @UseGuards(JwtAuthGuard)
    async kickMemberOfChannel(@Body() relation: ChannelUserDto) {
        return (this.ChannelService.kickMemberOfChannel(relation));
    }

    @Post('setPassword')
    @UseGuards(JwtAuthGuard)
    async setPasswordChannel(@Body() channelPassword: ChannelPasswordDto) {
        return (this.ChannelService.setPasswordToChannel(channelPassword));
    }

    @Post('addUserAsAdmin')
    @UseGuards(JwtAuthGuard)
    async addUserAsAdmin(@Body() relation: ChannelUserDto) {
        return (this.ChannelService.addUserAsAdmin(relation));
    }

    @Post('removeUserAsAdmin')
    @UseGuards(JwtAuthGuard)
    async removeUserAsAdmin(@Body() relation: ChannelUserDto) {
        return (this.ChannelService.removeUserAsAdmin(relation));
    }

    @Post('getAllAdminsOfChannel')
    @UseGuards(JwtAuthGuard)
    async getAllAdminsOfChannel(@Body() channelId: ChannelIdDto) {
        return (this.ChannelService.getAllAdminsOfChannel(channelId));
    }

    @Post('checkIfSamePassword')
    @UseGuards(JwtAuthGuard)
    async checkIfSamePassword(@Body() relation: ChannelPasswordDto) {
        return (this.ChannelService.checkIfSamePassword(relation));
    }

}