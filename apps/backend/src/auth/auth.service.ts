import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
import { IUser } from "src/types/types";
import * as argon2 from "argon2";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOne(username);
    const passwordIsCorrect = await argon2.verify(user.password, password);
    if (!(user && passwordIsCorrect)) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async login(user: IUser) {
    const { id, username, email } = user;
    return {
      id,
      username,
      email,
      access_token: this.jwtService.sign({
        id: user.id,
        username: user.username,
        email: user.email,
      }),
    };
  }
}
