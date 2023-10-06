import { IsNotEmpty } from "class-validator";

export class IdUserDto {
    @IsNotEmpty()
    id: number;
  }
  