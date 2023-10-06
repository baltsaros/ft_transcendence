import { User } from "src/user/entities/user.entity";
import { Column, Entity, OneToOne, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Match {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'userId'})
    userId: number;

    @ManyToOne(() => User, (user) => user.id, {eager: true})
    @JoinColumn({name: 'userId'})
    user: User;

    @Column({name: 'opponentId'})
    opponentId: number;

    @ManyToOne(() => User, (user) => user.id, {eager: true})
    @JoinColumn({name: 'opponentId'})
    opponent: User;

    @Column()
    scoreUser: number;

    @Column()
    scoreOpponent: number;

    // @Column({
    //     nullable: true
    // })
    // map: string = "default";

    // @Column({
    //     nullable: true
    // })
    // bonus: string[];
}