import { IsNotEmpty } from "class-validator";

export class ChannelPasswordDto {
    
  @IsNotEmpty()
    channelId: number;
  
  @IsNotEmpty()
    newPassword: string;

    @IsNotEmpty()
    oldPassword: string;

}  