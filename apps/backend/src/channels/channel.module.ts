import { Module } from '@nestjs/common'
import { ChannelsService } from './channels.service'
import { AddChannelController } from './channels.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Channels } from './channels.entity'
import { UserModule } from 'src/user/user.module'
import { UserService } from 'src/user/user.service'

@Module({
    imports: [
        UserModule,
        TypeOrmModule.forFeature([Channels])
    ],
    controllers: [AddChannelController],
    providers: [ChannelsService],
    exports: [ChannelsService],
})

export class AddChannelModule {}