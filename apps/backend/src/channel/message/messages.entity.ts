import { Channel } from 'src/channel/channel.entity';
import { User } from 'src/user/entities/user.entity';

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
} from 'typeorm'

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, (user) => user.messages)
    user: User
    
    @ManyToOne(() => Channel, channels => channels.messages)
    channel: Channel

    @Column()
    content: string

}