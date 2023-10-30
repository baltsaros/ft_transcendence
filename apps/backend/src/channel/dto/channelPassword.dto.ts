import { IsNotEmpty } from "class-validator";

export class ChannelPasswordDto {
  @IsNotEmpty()
  channelId: number;

  @IsNotEmpty()
  password: string;
}
