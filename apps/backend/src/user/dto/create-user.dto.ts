import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { PrimaryGeneratedColumn } from "typeorm";

export class CreateUserDto {
  @IsNotEmpty()
  username: string;
  
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  intraToken: string;

  @IsNotEmpty()
  avatar: string;

  @IsNotEmpty()
  intraId: number;
}
