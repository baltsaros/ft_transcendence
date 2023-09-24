import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { PrimaryGeneratedColumn } from "typeorm";

export class FriendRelationDto {
  @IsNotEmpty()
  idUser: number;
  
  @IsNotEmpty()
  idFriend: number;
}
