import { Inject, Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { Profile } from "passport-42";
import { Done } from "src/types/types";
import { AuthService } from "../auth.service";

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject("AUTH_SERVICE") private readonly authService: AuthService
  ) {
    super();
  }

  serializeUser(profile: Profile, done: Done) {
    console.log("serialize");
    done(null, profile);
  }

  async deserializeUser(profile: Profile, done: Done) {
    console.log("deserialize");
    const userDB = await this.authService.validateUser(null, profile);
    return userDB ? done(null, userDB) : done(null, null);
  }
}
