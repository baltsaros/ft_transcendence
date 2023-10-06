import { Module } from '@nestjs/common'
import { ChannelService } from './channel.service'
import { ChannelController } from './channel.controller'
import { Channel } from './channel.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from 'src/user/user.module'


@Module({
    imports: [
        UserModule,
        TypeOrmModule.forFeature([Channel]),
    ],
    controllers: [ChannelController],
    providers: [ChannelService],
    exports: [ChannelService],
})

export class ChannelModule {}