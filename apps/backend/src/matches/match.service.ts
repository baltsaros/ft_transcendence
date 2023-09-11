import { BadGatewayException, BadRequestException, Injectable, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { DataStorageService } from "src/helpers/data-storage.service";
import { User } from "src/user/entities/user.entity";
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

        //Check if the user exists.
       const user = await this.userService.findOne(createMatchDto.username);
       if (!user) throw new NotFoundException("User doesn't exist");
       
       //Check if the opponent exists.
       const opponent = await this.userService.findOne(createMatchDto.opponent);
       if (!opponent) throw new NotFoundException("Opponent doesn't exist");
   
        const newMatch = await this.matchRepository.save({
            user: user, 
            opponent: opponent,
            scoreUser: createMatchDto.scoreUser,
            scoreOpponent: createMatchDto.scoreOpponent
        });
        if (!newMatch) throw new BadGatewayException("Something went wrong when the match was added.");
        if (createMatchDto.scoreUser === createMatchDto.scoreOpponent) throw new UnprocessableEntityException("score cannot be equal");
        
        //Increment win and loss for user and opponent.
        if (createMatchDto.scoreUser > createMatchDto.scoreOpponent) {
            await this.userService.incrementWin(user.id);
            await this.userService.incrementLoss(opponent.id);
        }
        else {
            await this.userService.incrementLoss(user.id);
            await this.userService.incrementWin(opponent.id);
        }

        //Add the reversed match for the opponent to hahe the match in his history.
        const newMatchReverse = await this.matchRepository.save({
            user: opponent,
            opponent: user,
            scoreUser: createMatchDto.scoreOpponent,
            scoreOpponent: createMatchDto.scoreUser
        })
        if (!newMatch) throw new BadGatewayException("Something went wrong when the match was added.");
    }

    async findAllMatchForUser(id: number)
    {
        return await this.matchRepository.find({
            where:{
                userId: id
            }, 
            order: {
                id: "ASC"
            },
            
        })
    }

    //Clear all match and set back : loses, rank and wins to 0.
    async clearAllMatches()
    {
        await this.matchRepository.clear();
        const users = await this.userService.findAll();
        users.forEach(user => {
            user.wins = 0;
            user.loses = 0;
            user.rank = 0;
            this.userService.update(user.id, user);
        });
    }
}