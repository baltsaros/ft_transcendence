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
<<<<<<< HEAD
import { Message } from "src/channel/message/messages.entity";
import { Match } from "src/matches/entities/matches.entity";
=======
import { Match } from "src/matches/entities/matches.entity";
import { Message } from "src/channel/message/messages.entity";
>>>>>>> main

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

  @Column()
  authentication: boolean;

  @Column()
  rank: number;

  @Column()
  avatar: string;

  @ManyToMany(() => User)
  @JoinTable()
  friends: User[];

  @Column()
  status: string;

  // Change later
  // @OneToMany(() => Match, (match) => match.user)
  // matches: Match[];

  @ManyToMany(() => User)
  @JoinTable()
  blocked: User[];

  @Column()
  wins: number;

  @Column()
  loses: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Channel, channels => channels.owner)
  // {
  //   cascade: true
  // }
  channels: Channel[]

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[]

}

