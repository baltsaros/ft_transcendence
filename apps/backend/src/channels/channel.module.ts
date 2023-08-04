import { Module } from '@nestjs/common'
import { ChannelsService } from './channels.service'
import { AddChannelController } from './channels.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Channels } from './channels.entity'

@Module({
    imports: [
        TypeOrmModule.forFeature([Channels])
    ],
    controllers: [AddChannelController],
    providers: [ChannelsService],
    exports: [ChannelsService],
})

export class AddChannelModule {}