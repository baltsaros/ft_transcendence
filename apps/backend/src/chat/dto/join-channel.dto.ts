import { IsString, IsNotEmpty } from "class-validator";
import { User } from "src/user/entities/user.entity";

export class JoinChannelDto {
    @IsNotEmpty()
    name: string
    
    @IsNotEmpty()
    channelId: number;
}