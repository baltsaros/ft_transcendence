import { Module } from '@nestjs/common'
import { ChannelsService } from './channels.service'
import { ChannelController } from './channels.controller'
import { Channels } from './entities/channels.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from 'src/user/user.module'
import { userChannelService } from 'src/userChannel/userChannel.service'
import { userChannelModule } from 'src/userChannel/userChannel.module'
import { userChannel } from 'src/userChannel/userChannel.entity'

@Module({
    imports: [
        UserModule,
        userChannelModule,
        TypeOrmModule.forFeature([Channels, userChannel]),
    ],
    controllers: [ChannelController],
    providers: [ChannelsService, userChannelService],
    exports: [ChannelsService],
})

export class ChannelModule {}