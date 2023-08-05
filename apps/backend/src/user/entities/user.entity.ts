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

import { Channels } from "src/channels/channels.entity";

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
  rank: Number;

  @Column()
  avatar: string;

  @ManyToMany(() => User)
  @JoinTable()
  friends: User[];

  @Column()
  status: string;

  // Change later
  // @OneToMany()
  // history: History[];

  @ManyToMany(() => User)
  @JoinTable()
  blocked: User[];

  @Column()
  wins: Number;

  @Column()
  loses: Number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(()=> Channels, channels => channels.owner,
  {
    cascade: true
  })
  channel_owned: Channels[];
}
