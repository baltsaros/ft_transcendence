import { IsString, IsNotEmpty, IsTaxId } from 'class-validator'

export class CreateMessageDto {
    @IsNotEmpty()
    @IsString()
    username: string;
    
    @IsNotEmpty()
    @IsString()
    content: string;



}
