import { Messages } from 'src/messages/entities/messages.entity';
import { User } from 'src/user/entities/user.entity';
// import { userChannel } from 'src/userChannel/userChannel.entity'
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

    @OneToMany(()=> Messages, messages => messages.channel,
    {
        cascade: true
    })
    channelMessages: Messages[];

    // @ManyToOne(() => userChannel, userChannels => userChannels.channel)
    // userChannels: userChannel[]; 

    @ManyToMany(() => User, user => user.channel)
    @JoinTable()
    users: User[];

    // @Column("simple-array", {array: true})
    // administrators: string[];

    // @Column("simple-array", {array: true})
    // users: string[];

    // @Column("simple-array", {array: true})
    // muted_users: string[];

    // @Column("simple-array", {array: true})
    // banned_users: string[];

} 