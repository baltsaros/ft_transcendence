import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IResponseUser } from "src/types/types";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("JWT_SECRET"),
    });
  }

  async validate(user: IResponseUser) {
    return {
      id: user.id,
      intraId: user.intraId,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      intraToken: user.intraToken,
      secret: user.secret,
    };
  }
}
