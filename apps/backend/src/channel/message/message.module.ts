import { Module } from "@nestjs/common";
import { MessageController } from "./message.controller";
import { MessageService } from "./message.service";
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from "src/user/user.module";
import { ChannelModule } from "../channel.module";
import { Message } from "./messages.entity"; 

@Module(
    {
        imports: [ 
            TypeOrmModule.forFeature([Message]),
            UserModule,
            ChannelModule
        ],
        controllers: [MessageController],
        providers: [MessageService],
        exports: [MessageService]
    }
)

export class MessageModule {}