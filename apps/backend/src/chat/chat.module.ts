import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { UserModule } from 'src/user/user.module';
import { ChannelService } from 'src/channels/channels.service';
import { Channel } from 'src/channels/channels.entity';

@Module({
  imports: [ UserModule, TypeOrmModule.forFeature([ Channel])],
  providers: [ChatGateway, ChatService, ChannelService],
})
export class ChatModule {}
