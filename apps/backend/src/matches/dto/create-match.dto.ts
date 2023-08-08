import { IsDecimal, IsNotEmpty, IsPositive } from "class-validator";

export class CreateMatchDto {
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