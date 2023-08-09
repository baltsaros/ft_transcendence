import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
import { IUser } from "src/types/types";
import { Profile } from "passport-42";
import { DataStorageService } from "src/helpers/data-storage.service";
import { CreateUserDto } from "src/user/dto/create-user.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly dataStorage: DataStorageService
  ) {}

  async validateUser(accessToken: string, profile: Profile) {
    console.log("validateIntraUser");
    const user = await this.usersService.findOneByIntraId(
      profile.id,
      profile,
      accessToken
    );
    // console.log(profile);
    // console.log("username: " + profile.username);
    // console.log("email: " + profile._json.email);
    // console.log("avatar: " + profile._json.image.link);
    // console.log("intraId: " + profile.id);
    // console.log("intraToken: " + accessToken);
    if (!user) {
      this.dataStorage.setData(accessToken, profile);
      const data = new CreateUserDto();
      data["username"] = profile.username;
      data["email"] = profile._json.email;
      data["avatar"] = profile._json.image.link;
      data["intraId"] = profile.id;
      data["intraToken"] = accessToken;
      await this.usersService.create(data);
      return data;
    }
    return user;
  }

  async login(user: IUser) {
    const { id, username, avatar, intraId, email, intraToken } = user;
    return {
      intraId,
      intraToken,
      username,
      email,
      avatar,
      access_token: this.jwtService.sign({
        username: user.username,
        avatar: user.avatar,
        intraId: user.intraId,
        email: user.email,
        intraToken: user.intraToken,
      }),
    };
  }
}
