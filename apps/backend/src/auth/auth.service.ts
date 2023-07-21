import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		private usersService: UserService,
		private jwtService: JwtService
		) {}

	async signIn(username, pass) {
		const user = await this.usersService.findOne(username);
		// if (user?.password !== pass) {
		// 	throw new UnauthorizedException();
		// }
		// const payload = { sub: user.userId, username: user.username };
		// return {
		// 	access_token: await this.jwtService.signAsync(payload),
		// };
	}
}
