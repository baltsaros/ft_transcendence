import { Messages } from 'src/messages/entities/messages.entity';
import { User } from 'src/user/entities/user.entity';
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

    // @OneToMany(()=> Messages, messages => messages.channel,
    // {
    //     cascade: true
    // })
    // channelMessages: Messages[];

} 