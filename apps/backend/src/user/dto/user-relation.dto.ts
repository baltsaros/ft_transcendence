import { IsNotEmpty } from "class-validator";

export class UserRelationDto {

    @IsNotEmpty()
    receiverId: number;

    @IsNotEmpty()
    senderId: number;
  }
  