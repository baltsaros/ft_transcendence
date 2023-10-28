import { Profile, Strategy } from "passport-42";
import { PassportStrategy } from "@nestjs/passport";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "../auth.service";

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, "42") {
  constructor(
    private readonly configService: ConfigService,
    @Inject("AUTH_SERVICE") private readonly authService: AuthService
  ) {
    super({
      clientID: configService.get("UID"),
      clientSecret: configService.get("SECRET"),
      callbackURL: configService.get("SERVER_URL"),
      scope: ["public"],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const data = await this.authService.validateUser(accessToken, profile);
    return { user: data.user, accessToken: accessToken, first: data.first };
  }
}
