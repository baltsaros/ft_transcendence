/* Modules encapsulating controllers and providers 
** A provider/service can, for example, fetches data from the database, and a controller can make use of that provider
** The code in the controller will thus remain lean. ==> modularity of Nestjs
** Modules bundle multiple controllers and providers. Modules can depend on each others
** Modules are typically splitted by features of our web application
*/
import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { AddChannelModule } from "./channels/channel.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { AuthService } from "./auth/auth.service";
import { PassportModule } from "@nestjs/passport";
import { JwtService } from "@nestjs/jwt";
import { DataStorageService } from "./helpers/data-storage.service";
import { ChannelsModule } from "./channels/channels.module";

@Module({
  imports: [
    UserModule,
    AuthModule,
    AddChannelModule,
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
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService, JwtService, DataStorageService],
})
export class AppModule {}
