import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { userChannelService } from 'src/userChannel/userChannel.service'
import { userChannel } from './userChannel.entity'


@Module({
    imports: [TypeOrmModule.forFeature([userChannel])],
    controllers: [],
    providers: [userChannelService],
    exports: [],
})

export class userChannelModule {}