import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinTable,
} from "typeorm";

import { Channel } from "src/channel/channel.entity";
import { Match } from "src/matches/entities/matches.entity";
import { Message } from "src/channel/message/messages.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    nullable: true,
   })
  intraId: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({nullable: true})
  intraToken: string;

  @Column({default: false})
  twoFactorAuth: boolean;

  @Column({default: false})
  secret: string;

  @Column()
  rank: number;

  @Column()
  avatar: string;

  @ManyToMany(() => User)
  @JoinTable({
    name: "user_friends_user",
    joinColumn: {
      name: "receiver",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "sender",
      referencedColumnName: "id"
    }
  })
  friends: User[];

  @ManyToMany(() => User)
  @JoinTable({
    name: "user_invitations_user",
    joinColumn: {
      name: "receiver",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "sender",
      referencedColumnName: "id"
    }
  })
  invitations: User[];

  @Column()
  status: string;

  @ManyToMany(() => User)
  @JoinTable({
    name: "user_block_user",
    joinColumn: {
      name: "blocker",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "blocked",
      referencedColumnName: "id"
    }
  })
  blocked: User[];

  @Column()
  wins: number;

  @Column()
  loses: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Channel, channels => channels.owner)
  channels: Channel[]

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[]

}

