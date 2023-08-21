import { IsNotEmpty } from "class-validator"

export class newMessageDto {
    @IsNotEmpty()
    channelId: number | undefined;
    
    @IsNotEmpty()
    username: string | undefined;
    
    @IsNotEmpty()
    message: string;
}