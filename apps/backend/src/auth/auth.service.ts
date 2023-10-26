import {
  Injectable,
  NotImplementedException,
} from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
import { IResponseUser } from "src/types/types";
import { Profile } from "passport-42";
import { DataStorageService } from "src/helpers/data-storage.service";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { authenticator } from "otplib";
import { toDataURL } from "qrcode";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly dataStorage: DataStorageService
  ) {}

  async validateUser(accessToken: string, profile: Profile) {
    const user = await this.usersService.findOneByIntraId(profile.id);
    if (!user) {
      const data = new CreateUserDto();
      data["username"] = profile.username;
      data["email"] = profile._json.email;
      data["avatar"] = profile._json.image.link;
      data["intraId"] = profile.id;
      data["intraToken"] = accessToken;
      const new_user = await this.usersService.create(data);
      return {user: new_user, first: true};
    }
    return {user: user, first: false};
  }

  async login(user: IResponseUser) {
    const { id, username, avatar, intraId, email, intraToken } = user;
    return {
      id,
      intraId,
      intraToken,
      username,
      email,
      avatar,
      access_token: this.jwtService.sign({
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        intraId: user.intraId,
        email: user.email,
        intraToken: user.intraToken,
      }),
    };
  }

  async loginWithTwoFA(user: IResponseUser) {
    const { id, username, avatar, intraId, email, intraToken } = user;
    return {
      id,
      intraId,
      intraToken,
      username,
      email,
      avatar,
      access_token: this.jwtService.sign({
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        intraId: user.intraId,
        email: user.email,
        intraToken: user.intraToken,
      }),
    };
  }

  async getProfile(intraId: number) {
    const user = await this.usersService.findOneByIntraId(intraId);
    if (!user)
      throw new NotImplementedException(
        "Cannot retrieve intraId in getProfile()"
      );
    return user;
  }

  generateSecret() {
    const secret = authenticator.generateSecret();
    return secret;
  }

  async generateQrCodeUrl(user: IResponseUser) {
    const otpauthUrl = authenticator.keyuri(user.email, "Ponger", user.secret);
    await this.usersService.setSecret(user.secret, user.intraId);
    return toDataURL(otpauthUrl);
  }

  isTwoFactorAuthSecretValid(code: string, secret: string) {
    return authenticator.verify({
      token: code,
      secret: secret,
    });
  }
}
