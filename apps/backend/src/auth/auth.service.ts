import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
import { IUser } from "src/types/types";
import * as argon2 from "argon2";
import { Profile } from "passport-42";
import { DataStorageService } from "src/helpers/data-storage.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly dataStorage: DataStorageService,
  ) {}

  async validateUser(username: string, password: string) {
    console.log('validateIntra');
    const user = await this.usersService.findOne(username);
    const passwordIsCorrect = await argon2.verify(user.password, password);
    if (!(user && passwordIsCorrect)) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async validateIntraUser(accessToken: string, profile: Profile) {
    console.log('validateIntraUser');
    const user = await this.usersService.findOneById(profile.id, profile, accessToken);
    if (!user)
      this.dataStorage.setData(accessToken, profile);
    return user;
  }

  // async findUser(id: number) {
  //   console.log('auth find user');
  //   const user = await this.usersService.findOneById(id);
  //   if (!user)
  //     throw new UnauthorizedException();
  //   return user;
  // }

  async login(user: IUser) {
    const { id, username, email, avatar } = user;
    return {
      id,
      username,
      email,
      avatar,
      access_token: this.jwtService.sign({
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      }),
    };
  }
}
