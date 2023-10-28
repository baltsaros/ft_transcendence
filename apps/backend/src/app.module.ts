
import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { ChannelModule } from "./channel/channel.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { AuthService } from "./auth/auth.service";
import { PassportModule } from "@nestjs/passport";
import { MessageModule } from "./channel/message/message.module";
import { JwtService } from "@nestjs/jwt";
import { DataStorageService } from "./helpers/data-storage.service";
import { MatchModule } from "./matches/match.module";
import { GatewayModule } from "./gateway/gateway.module";
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ChatGateway } from "./gateway/chat.gateway";
import { GatewaySessionManager } from "./gateway/gateway.session";
import { Channel } from "./channel/channel.entity";
import { User } from "./user/entities/user.entity";
import { PongGateway } from "./gateway/pong.gateway";

@Module({
  imports: [
    UserModule,
    EventEmitterModule.forRoot(),
    AuthModule,
    MatchModule,
    ChannelModule,
    MessageModule,
    GatewayModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule.register({ session: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("POSTGRES_HOST"),
        port: configService.get("POSTGRES_PORT"),
        username: configService.get("POSTGRES_USER"),
        password: configService.get("POSTGRES_PASSWORD"),
        database: configService.get("POSTGRES_DB"),
        synchronize: true,
        entities: [__dirname + "/**/*.entity{.js, .ts}"],
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Channel, User]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "../..", "frontend", "dist"),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthService,
    JwtService,
    DataStorageService,
    ChatGateway,
	PongGateway,
    GatewaySessionManager,
  ],
})
export class AppModule {}
