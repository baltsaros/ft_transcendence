import { PartialType } from '@nestjs/mapped-types';
import { CreateChatDto } from './create-message.dto';

export class UpdateChatDto extends PartialType(CreateChatDto) {
  id: number;
}
