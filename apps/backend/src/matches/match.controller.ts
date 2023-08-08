import { Body, Controller, Get, Param, Post, UsePipes } from "@nestjs/common";
import { CreateMatchDto } from "./dto/create-match.dto";
import { MatchService } from "./match.service";

@Controller('matches')
export class MatchController {
    constructor(private readonly matchService: MatchService) {}

    @Get(':username')
    findAllMatchForUser(@Param('username') username: string) {
        return this.matchService.findAllMatchForUser(username)
    }

    @Post()
    @UsePipes()
    createMatch(@Body() createMatchDto: CreateMatchDto) {
        return this.matchService.createMatch(createMatchDto);
    }
}