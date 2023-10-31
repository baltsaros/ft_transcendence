import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Request,
  Response,
  UseGuards,
  Inject,
  NotImplementedException,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { FortyTwoAuthGuard } from "./guards/42.guard";

@Controller("auth")
export class AuthController {
  constructor(
    @Inject("AUTH_SERVICE") private readonly authService: AuthService
  ) {}

  @Get("redir")
  @UseGuards(FortyTwoAuthGuard)
  async fortyTwoAPI(@Request() req, @Response({ passthrough: true }) res) {
    const user = req.user.user;
    const firstEntry = req.user.first;
    const path = process.env.REDIR
      ? process.env.REDIR
      : "http://localhost:5173";
    if (user.twoFactorAuth) {
      res.cookie("intraId", user.intraId, {
        sameSite: "none",
        secure: true,
      });
      return res.redirect(path + "/auth");
    }
    const jwt = await this.authService.login(user);
    res.cookie("jwt_token", jwt.access_token, {
      sameSite: "none",
      secure: true,
    });
    res.cookie("username", user.username, {
      sameSite: "none",
      secure: true,
    });
    if (firstEntry) return res.redirect(path + "/edit");
    return res.redirect(path);
  }

  @Post("login")
  @UseGuards(FortyTwoAuthGuard)
  async login(@Request() req) {
    return this.authService.login(req.body);
  }

  @Get("profile")
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    const intraId = req.user.intraId;
    if (!intraId)
      throw new NotImplementedException(
        "Cannot retrieve intraId in getProfile()"
      );
    const user = await this.authService.getProfile(intraId);
    return user;
  }

  @Get("QrCode-generate/:intraId")
  async generateQrCode(@Param("intraId") intraId: string, @Request() req) {
    if (!intraId)
      throw new NotImplementedException(
        "Cannot retrieve intraId in getProfile()"
      );
    const user = await this.authService.getProfile(parseInt(intraId));
    const otpauthUrl = await this.authService.generateQrCodeUrl(user);
    return otpauthUrl;
  }

  @Get("2fa-generate")
  @UseGuards(JwtAuthGuard)
  generateTwoFactorAuthenticationSecret(@Request() req) {
    const secret = this.authService.generateSecret();
    if (!secret) throw new NotImplementedException("Cannot generate a secret!");
    return secret;
  }

  @Post("2fa")
  async authenticate(@Request() req, @Body() body) {
    const intraId = parseInt(body.intraId);
    if (!intraId)
      throw new NotImplementedException(
        "Cannot retrieve intraId in getProfile()"
      );
    const user = await this.authService.getProfile(intraId);
    const isCodeValid = this.authService.isTwoFactorAuthSecretValid(
      body.code,
      user.secret
    );
    if (!isCodeValid)
      throw new UnauthorizedException("Wrong authentication code");
    const jwt = await this.authService.loginWithTwoFA(user);
    return { jwt: jwt.access_token, valid: isCodeValid };
  }
}
function useChatWebSocket() {
  throw new Error("Function not implemented.");
}
