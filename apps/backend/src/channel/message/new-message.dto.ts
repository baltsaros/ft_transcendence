import { IsNotEmpty } from "class-validator"
import { IResponseUser } from "src/types/types";

export class newMessageDto {
    @IsNotEmpty()
    channelId: number | undefined;
    
    @IsNotEmpty()
    user: IResponseUser | undefined;
    
    @IsNotEmpty()
    content: string;
}