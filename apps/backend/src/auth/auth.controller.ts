import {
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  Request,
  Response,
  UseGuards,
  Inject,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { Public } from "./decorators/public.decorators";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { AuthGuard } from "@nestjs/passport";
import { FortyTwoAuthGuard } from "./guards/42.guard";

@Controller("auth")
export class AuthController {
  constructor(
    @Inject("AUTH_SERVICE") private readonly authService: AuthService
  ) {}

  @Get("redir")
  @UseGuards(FortyTwoAuthGuard)
  async fortyTwoAPI(@Request() req, @Response() res) {
    const user = req.user.user;
    const jwt = await this.authService.login(user);
    res.cookie("jwt_token", jwt.access_token, {
      sameSite: "none",
      secure: true,
    });
    return res.redirect("http://localhost:5173/");
  }

  @Post("login")
  @UseGuards(FortyTwoAuthGuard)
  async login(@Request() req) {
    return this.authService.login(req.body);
  }

  @Get("profile")
  // @UseGuards(FortyTwoAuthGuard)
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return req.user;
  }
}
