
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
import { ChatGateway } from "./chat/chat.gateway";
import { ChatModule } from "./chat/chat.module";
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    UserModule,
    EventEmitterModule.forRoot(),
    AuthModule,
    ChannelModule,
    MessageModule,
    ChatModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule.register({ session: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("DB_HOST"),
        port: configService.get("DB_PORT"),
        username: configService.get("DB_USERNAME"),
        password: configService.get("DB_PASSWORD"),
        database: configService.get("DB_DATABASE"),
        synchronize: true,
        entities: [__dirname + "/**/*.entity{.js, .ts}"],
      }),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "../..", "frontend", "dist"),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AuthService, JwtService, DataStorageService, ChatGateway],
})
export class AppModule {}
