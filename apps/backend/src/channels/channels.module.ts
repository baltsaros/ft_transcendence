import { Module } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { AddChannelController } from './channels.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channels } from './channels.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [
    TypeOrmModule.forFeature([Channels]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '30d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AddChannelController],
  providers: [ChannelsService],
  exports: [ChannelsService],
})
export class ChannelsModule {}
