import { 
	Body,
	Controller,
	Get,
	Post,
	HttpCode,
	HttpStatus,
	Request,
	UseGuards
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from './decorators/public.decorators';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	// @Public()
	// @HttpCode(HttpStatus.OK)
	// guard make calls the linked strategy that is supposed to validate a user
	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Request() req) {
		return this.authService.login(req.user);
	}

	// @Public()
	@UseGuards(JwtAuthGuard)
	@Get('profile')
	async getProfile(@Request() req) {
		return req.user;
	}
}
