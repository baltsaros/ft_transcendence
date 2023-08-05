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

    @Column({nullable: true})
    name: string;
    
    @Column()
    mode: string;
    
    @Column({nullable: true})
    owner: string;

    // @Column()
    // password: string;

    // @Column("simple-array", {array: true})
    // administrators: string[];

    // @Column("simple-array", {array: true})
    // users: string[];

    // @Column("simple-array", {array: true})
    // muted_users: string[];

    // @Column("simple-array", {array: true})
    // banned_users: string[];

    // @OneToMany(()=> Messages, messages => messages.channels,
    // {
    //     cascade: true
    // })
    // channel_messages: Messages[];
} 