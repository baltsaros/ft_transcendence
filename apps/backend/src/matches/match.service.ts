import { BadGatewayException, Injectable, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
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
    
      async addMatchesToDatabase(user: User, opponent: User, match: CreateMatchDto) {
        const newMatch = await this.matchRepository.save({
            user: user, 
            opponent: opponent,
            scoreUser: match.scoreUser,
            scoreOpponent: match.scoreOpponent
        });
        if (!newMatch) throw new BadGatewayException("Something went wrong when the match was added.");
        //Add the reversed match for the opponent to hahe the match in his history.
        const newMatchReverse = await this.matchRepository.save({
            user: opponent,
            opponent: user,
            scoreUser: match.scoreOpponent,
            scoreOpponent: match.scoreUser
        })
        if (!newMatch) throw new BadGatewayException("Something went wrong when the match was added.");
        
      }

      async createMatch(createMatchDto: CreateMatchDto) {
        
        //Check if the score are different
        if (createMatchDto.scoreUser === createMatchDto.scoreOpponent) throw new UnprocessableEntityException("score cannot be equal");
        
        //Check if username are different
        if (createMatchDto.opponent === createMatchDto.username) throw new UnprocessableEntityException("Usernames cannot be the same");

        //Check if the user exists.
       const user = await this.userService.findOne(createMatchDto.username);
       if (!user) throw new NotFoundException("User doesn't exist");
       
       //Check if the opponent exists.
       const opponent = await this.userService.findOne(createMatchDto.opponent);
       if (!opponent) throw new NotFoundException("Opponent doesn't exist");
   
        this.addMatchesToDatabase(user, opponent, createMatchDto);
        
        //Increment win and loss for user and opponent.
        if (createMatchDto.scoreUser > createMatchDto.scoreOpponent) {
            await this.userService.incrementWin(user.id);
            await this.userService.incrementLoss(opponent.id);
        }
        else {
            await this.userService.incrementLoss(user.id);
            await this.userService.incrementWin(opponent.id);
        }
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