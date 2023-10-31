import { BadRequestException, Body, Controller, Get, Param, Post, UseGuards, UsePipes } from "@nestjs/common";
import { CreateMatchDto } from "./dto/create-match.dto";
import { MatchService } from "./match.service";
import { UserService } from "src/user/user.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";

@Controller('matches')
export class MatchController {
    constructor(
        private readonly matchService: MatchService,
        private readonly userService: UserService) {}

    @Get(':username')
    @UseGuards(JwtAuthGuard)
    async findAllMatchForUser(@Param('username') username: string) {
        const user = await this.userService.findOne(username);
        if (!user)
            throw new BadRequestException("User doens't exist")
        const match = await this.matchService.findAllMatchForUser(user.id)
        // console.log(match.length)
        return (match);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @UsePipes()
    createMatch(@Body() createMatchDto: CreateMatchDto) {
        return this.matchService.createMatch(createMatchDto);
    }

    //Only for testing needs to be delete
    @Post(":clear")
    @UseGuards(JwtAuthGuard)
    async clearAllMatches() {
        await this.matchService.clearAllMatches();
    }
}