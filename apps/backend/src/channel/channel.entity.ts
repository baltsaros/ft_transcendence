import { Message } from 'src/channel/message/messages.entity';
import { User } from 'src/user/entities/user.entity';
import { Expose } from 'class-transformer'
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne,
    ManyToMany,
    JoinTable,
} from 'typeorm';

// Entity is a TypeScript class that maps to a database table
@Entity()
export class Channel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    name: string;
    
    @Column()
    mode: string;
    
    @ManyToOne(() => User, user =>  user.channels)
    owner: User;

    @Column({nullable: true})
    password: string;

    @ManyToMany(() => User)
    @JoinTable({ name: 'user_channel'})
    users: User[];

    @OneToMany(()=> Message, messages => messages.channel)
    channelMessages: Message[];

    // @Expose()
    // getId(): number {
    //     return this.id;
    // }
    
    // @Expose()
    // getName(): string {
    //     return this.name;
    // }
} 