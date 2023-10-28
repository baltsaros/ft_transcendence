import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  Patch,
  Param,
} from "@nestjs/common";
import { ChannelService } from "./channel.service";
import { IChannelDmData, IChannelsData } from "src/types/types";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { ChannelUserDto } from "./dto/channelUser.dto";
import { ChannelPasswordDto } from "./dto/channelPassword.dto";
import { ChannelIdDto } from "./dto/channelIdDto.dto";

@Controller("channel")
export class ChannelController {
  constructor(private readonly ChannelService: ChannelService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createChannel(@Body() channelData: IChannelsData) {
    const newChannel = await this.ChannelService.createChannel(channelData);
    return newChannel;
  }

  @Post("dmChannel")
  @UseGuards(JwtAuthGuard)
  async createDmChannel(@Body() channelDmData: IChannelDmData) {
    const newDmChannel = await this.ChannelService.createDmChannel(
      channelDmData
    );
    return newDmChannel;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getChannel() {
    return await this.ChannelService.findAll();
  }

  @Get("getPass/:channelId")
  @UseGuards(JwtAuthGuard)
  async getHashedPass(@Param("channelId") channelId: string) {
    return await this.ChannelService.getHashedPass(channelId);
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  async fetchMessage(@Query("channelId") channelId: number) {
    return this.ChannelService.fetchMessage(channelId);
  }

  @Post("leaveChannel")
  @UseGuards(JwtAuthGuard)
  async leaveChannel(@Body() payload: { channelId: number; username: string }) {
    return this.ChannelService.leaveChannel(payload);
  }

  @Post("kickMemberOfChannel")
  @UseGuards(JwtAuthGuard)
  async kickMemberOfChannel(@Body() relation: ChannelUserDto) {
    return this.ChannelService.kickMemberOfChannel(relation);
  }

  @Patch("setPassword")
  @UseGuards(JwtAuthGuard)
  async setPasswordChannel(@Body() channelPassword: ChannelPasswordDto) {
    return this.ChannelService.setPasswordToChannel(channelPassword);
  }

  @Post("addUserAsAdmin")
  @UseGuards(JwtAuthGuard)
  async addUserAsAdmin(@Body() relation: ChannelUserDto) {
    return this.ChannelService.addUserAsAdmin(relation);
  }

  @Post("removeUserAsAdmin")
  @UseGuards(JwtAuthGuard)
  async removeUserAsAdmin(@Body() relation: ChannelUserDto) {
    return this.ChannelService.removeUserAsAdmin(relation);
  }

  @Post("getAllAdminsOfChannel")
  @UseGuards(JwtAuthGuard)
  async getAllAdminsOfChannel(@Body() channelId: ChannelIdDto) {
    return this.ChannelService.getAllAdminsOfChannel(channelId);
  }

  @Post("checkIfSamePassword")
  @UseGuards(JwtAuthGuard)
  async checkIfSamePassword(@Body() relation: ChannelPasswordDto) {
    return this.ChannelService.checkIfSamePassword(relation);
  }

  @Post("getChannelById")
  @UseGuards(JwtAuthGuard)
  async getChannelById(@Body() channelId: ChannelIdDto) {
    return this.ChannelService.findOne(channelId.idChannel);
  }

  @Post("getAllBannedUsers")
  @UseGuards(JwtAuthGuard)
  async getAllBannedUsersOfChannel(@Body() channelId: ChannelIdDto) {
    return this.ChannelService.getAllBannedUsersOfChannel(channelId);
  }

  @Post("addBannedUserToChannel")
  @UseGuards(JwtAuthGuard)
  async addBannedUserToChannel(@Body() relation: ChannelUserDto) {
    return this.ChannelService.addBannedUserToChannel(relation);
  }
}
