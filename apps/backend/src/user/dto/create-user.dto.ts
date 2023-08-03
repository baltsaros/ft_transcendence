import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  username: string;
  
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(6, {message: 'Password must be longer than 5 characters'})
  @IsNotEmpty()
  password: string;

  // @IsNotEmpty()
  // avatar: string;

  // @IsNotEmpty()
  // intra_id: number;
}
