import { 
	Body,
	Controller,
	Get,
	Post,
	HttpCode,
	HttpStatus,
	Request,
	Res,
	UseGuards,
	Inject
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from './decorators/public.decorators';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { FortyTwoAuthGuard } from './guards/42.guard';

@Controller('auth')
export class AuthController {
	constructor(@Inject("AUTH_SERVICE") private readonly authService: AuthService) {}

	@Get('redir')
	@UseGuards(FortyTwoAuthGuard)
	async  printLog(@Res() res) {
		console.log('printLog');
		return res.redirect('http://localhost:5173/');
	}

	@Post('login')
	@UseGuards(FortyTwoAuthGuard)
	@UseGuards(LocalAuthGuard)
	async login(@Request() req) {
		return this.authService.login(req.user);
	}

	@Get('profile')
	@UseGuards(FortyTwoAuthGuard)
	@UseGuards(JwtAuthGuard)
	async getProfile(@Request() req) {
		return req.user;
	}
}
