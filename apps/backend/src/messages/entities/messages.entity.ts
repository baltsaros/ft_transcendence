import { Channels } from 'src/channels/channels.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn
} from 'typeorm'

@Entity()
export class Messages {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @Column()
    user: string;

    @ManyToOne(() => Channels, channels => channels.channel_messages)
    channels: Channels;
}