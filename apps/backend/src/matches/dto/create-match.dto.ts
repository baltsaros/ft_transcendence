import { IsNotEmpty, IsPositive } from "class-validator";

export class CreateMatchDto {

    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    opponent: string;

    @IsNotEmpty()
    @IsPositive()
    scoreUser: number;
    
    @IsNotEmpty()
    @IsPositive()
    scoreOpponent: number;
}