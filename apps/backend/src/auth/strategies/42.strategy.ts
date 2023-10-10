import { Profile, Strategy } from "passport-42";
import { PassportStrategy } from "@nestjs/passport";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IUser } from "src/types/types";
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
    // console.log("42 api");
    // console.log(profile);
    // console.log("id: " + profile.id);
    // console.log("login: " + profile.username);
    // console.log("avatar: " + profile._json.image.link);
    // console.log("token: " + accessToken);
    // const {id, username, _json} = profile;
    // console.log("profile: " + profile._json.image.link + profile._json.id);
    const data = await this.authService.validateUser(accessToken, profile);
    // console.log(user);
    return { user: data.user, accessToken: accessToken, first: data.first };
  }
}
