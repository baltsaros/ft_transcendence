import { Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { TypeOrmModule } from '@nestjs/typeorm'
import { Channel } from "src/channel/channel.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Channel])],
    controllers: [],
    providers: [ChatService],
    exports: [ChatService],
})

export class ChatModule {}