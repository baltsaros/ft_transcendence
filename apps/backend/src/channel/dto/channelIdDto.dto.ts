import { IsNotEmpty } from "class-validator";

export class ChannelIdDto {
    
  @IsNotEmpty()
    idChannel: number;

}  