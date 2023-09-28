import { IsNotEmpty } from "class-validator";

export class ChannelUserDto {
    
  @IsNotEmpty()
    idChannel: number;
  
  @IsNotEmpty()
    idUser: number;

}  