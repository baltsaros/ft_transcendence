import { Channels } from 'src/channels/entities/channels.entity';
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
    
    @ManyToOne(() => Channels, channels => channels.channelMessages)
    channels: Channels;

    // @Column()
    // content: string;

    // @Column()
    // user: string;

}