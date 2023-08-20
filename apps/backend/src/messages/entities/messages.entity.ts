import { Channel } from 'src/channels/channels.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
} from 'typeorm'

@Entity()
export class Messages {
    @PrimaryGeneratedColumn()
    id: number;
    
    @ManyToOne(() => Channel, channels => channels.channelMessages)
    channel: Channel;

}