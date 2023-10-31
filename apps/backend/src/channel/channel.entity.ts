import { Message } from 'src/channel/message/messages.entity';
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

    @OneToMany(()=> Message, messages => messages.channel)
    messages: Message[];

    @ManyToMany(() => User)
    @JoinTable({
        name: "channel_muted_user",
        joinColumn: {
            name: "channelId",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "mutedUser",
            referencedColumnName: "id"
        }
    })
    mutedUsers: User[];

    @ManyToMany(() => User)
    @JoinTable({
        name: "channel_admins",
        joinColumn: {
            name: "channelId",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "adminId",
            referencedColumnName: "id"
        }
    })
    adminUsers: User[];

    @ManyToMany(() => User)
    @JoinTable({
        name: "channel_banned_users",
        joinColumn: {
            name: "channelId",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "bannedUserId",
            referencedColumnName: "id"
        }
    })
    banned: User[];
}