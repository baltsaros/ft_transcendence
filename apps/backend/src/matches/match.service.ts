import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { DataStorageService } from "src/helpers/data-storage.service";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";
import { CreateMatchDto } from "./dto/create-match.dto";
import { Match } from "./entities/matches.entity";

@Injectable()
export class MatchService {
    constructor(
        @InjectRepository(Match) private readonly matchRepository: Repository<Match>,
        private readonly jwtService: JwtService,
        private readonly dataStorage: DataStorageService,
        private readonly userService: UserService
      ) {}

    async createMatch(createMatchDto: CreateMatchDto) {
        console.log("user = ", createMatchDto.username);
        console.log("oppo = " + createMatchDto.opponent);
        console.log("score = " + createMatchDto.scoreUser);
        console.log("score oppo = " + createMatchDto.scoreOpponent);
        const existUser = this.userService.findOne(createMatchDto.username);
        if (!existUser)
            throw new BadRequestException("User not present in database.");
        const existOpponent = this.userService.findOne(createMatchDto.opponent);
        if (!existOpponent)
            throw new BadRequestException("Opponent not present in database.");
        const match = await this.matchRepository.save({
            user: createMatchDto.username,
            opponent: createMatchDto.opponent,
            scoreUser: createMatchDto.scoreUser,
            scoreOpponent: createMatchDto.scoreOpponent
        });

        return {match}
    }

    async findAllMatchForUser(username: string)
    {
        return 'this get all matches';
    }
}