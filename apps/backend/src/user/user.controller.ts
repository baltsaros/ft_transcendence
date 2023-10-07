
import {
  Controller,
  Get,
  Req,
  Res,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UsePipes,
  ValidationPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { randomUUID } from "crypto";
import Path = require("path");
import { UserRelationDto } from "./dto/user-relation.dto";
import { IdUserDto } from "./dto/id-user.dto";
import { User } from "./entities/user.entity";

const storage = {
  storage: diskStorage({
    destination: "src/uploads/avatars",
    filename: (req, file, cb) => {
      const filename: string = "avatar-" + randomUUID();
      const extension: string = Path.parse(file.originalname).ext;
      cb(null, `${filename}${extension}`);
    },
  }),
};

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(":name")
  findOne(@Param("name") name: string) {
    return this.userService.findOne(name);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  remove(@Param("id") id: string) {
    return this.userService.remove(+id);
  }

  @Post("upload/:id")
  @UseInterceptors(FileInterceptor("file", storage))
  @UseGuards(JwtAuthGuard)
  uploadAvatar(
    @Req() req,
    @Param("id") id: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    return file;
  }

  @Get("avatars/:path")
  @UseGuards(JwtAuthGuard)
  getAvatar(@Param("path") avatar, @Res() res) {
    console.log("getAvatar");
    res.sendFile("/avatars/" + avatar, { root: "./src/uploads" });
  }
  @Post("getFriends")
  @UseGuards(JwtAuthGuard)
  getAllFriendsForUser(@Body() user: IdUserDto) {
    return (this.userService.findAllFriends(user.id));
  }

  @Post("online")
  @UseGuards(JwtAuthGuard)
  getAllOnlineUsers() {
    return (this.userService.findAllOnlineUsers());
  }

  @Post("offline")
  @UseGuards(JwtAuthGuard)
  getAllOfflineUsers() {
    return (this.userService.findAllOfflineUsers());
  }

  @Post("removeFriend")
  @UseGuards(JwtAuthGuard)
  removeFriend(@Body() friendRelation: UserRelationDto) {
    return (this.userService.removeFriendRelation(friendRelation));
  }
  @Post("getInvitations")
  @UseGuards(JwtAuthGuard)
  getAllInvitations(@Body() user: IdUserDto) {
    return (this.userService.getAllInvitations(user.id));
  }

  @Post("acceptInvitation")
  @UseGuards(JwtAuthGuard)
  acceptInvitation(@Body() invitation: UserRelationDto) {
    return (this.userService.acceptInvitation(invitation));
  }

  @Post("refuseInvitation")
  @UseGuards(JwtAuthGuard)
  refuseInvitation(@Body() invitation: UserRelationDto) {
    return (this.userService.removeInvitation(invitation));
  }

  @Post("sendInvitation")
  @UseGuards(JwtAuthGuard)
  sendInvitation(@Body() invitation: UserRelationDto) {
    return (this.userService.sendInvitation(invitation));
  }

  @Post("blockUser")
  @UseGuards(JwtAuthGuard)
  blockUser(@Body() invitation: UserRelationDto) {
    return (this.userService.blockUser(invitation));
  }

  @Post("getBlocked")
  @UseGuards(JwtAuthGuard)
  getBlocked(@Body() relation: UserRelationDto) {
    return (this.userService.getBlocked(relation));
  }

  @Post("getFriend")
  @UseGuards(JwtAuthGuard)
  getFriend(@Body() relation: UserRelationDto) {
    return (this.userService.getFriend(relation));
  }

  @Post("unblockUser")
  @UseGuards(JwtAuthGuard)
  unblockUser(@Body() relation: UserRelationDto) {
    return (this.userService.unblockUser(relation));
  }
}
