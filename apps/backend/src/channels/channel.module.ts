import { Module } from '@nestjs/common'
import { ChannelService } from './channels.service'
import { ChannelController } from './channels.controller'
import { Channel } from './channels.entity'
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