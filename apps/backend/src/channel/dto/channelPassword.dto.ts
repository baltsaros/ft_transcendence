import { IsNotEmpty } from "class-validator";

export class ChannelPasswordDto {
    
  @IsNotEmpty()
    idChannel: number;
  
  @IsNotEmpty()
    password: string;

}  