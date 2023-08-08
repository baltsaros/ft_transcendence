import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataStorageService } from 'src/helpers/data-storage.service';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { Match } from './entities/matches.entity';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';


@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Match]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '30d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MatchController],
  providers: [MatchService, DataStorageService],
  exports: [MatchService],
})
export class MatchModule {}