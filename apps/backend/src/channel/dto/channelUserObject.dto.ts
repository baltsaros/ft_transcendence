import { IsNotEmpty } from "class-validator";
import { IChannel, IUser } from "src/types/types";

export class ChannelUserObjectDto {
    
  @IsNotEmpty()
    channel: IChannel;
  
  @IsNotEmpty()
    user: IUser;

}  