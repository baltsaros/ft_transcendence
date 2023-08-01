import { Messages } from 'src/messages/entities/messages.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    JoinColumn
} from 'typeorm';

@Entity()
export class Channels {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'channel_name'})
    name: string;

    @Column("simple-array", {array: true})
    status: string[];

    @Column()
    password: string;

    @Column()
    owner: string;

    @Column("simple-array", {array: true})
    administrators: string[];

    @Column("simple-array", {array: true})
    users: string[];

    @Column("simple-array", {array: true})
    muted_users: string[];

    @Column("simple-array", {array: true})
    banned_users: string[];

    @OneToMany(()=> Messages, messages => messages.channels,
    {
        cascade: true
    })
    channel_messages: Messages[];
} 