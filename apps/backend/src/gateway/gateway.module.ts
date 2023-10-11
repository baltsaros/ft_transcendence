import { Module } from "@nestjs/common";
import { GatewayService } from "./gateway.service";
import { TypeOrmModule } from '@nestjs/typeorm'
import { Channel } from "src/channel/channel.entity";
import { GatewaySessionManager } from "./gateway.session";
import { UserModule } from "src/user/user.module";
import { ChannelModule } from "src/channel/channel.module";
import { User } from "src/user/entities/user.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Channel, User]),
        UserModule,
        ChannelModule,
    ],
    controllers: [],
    providers: [GatewayService, GatewaySessionManager],
    exports: [GatewayService],
})

export class GatewayModule {}