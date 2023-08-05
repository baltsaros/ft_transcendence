import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

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
