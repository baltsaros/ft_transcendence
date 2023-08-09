import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Match {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user: string;

    @Column()
    opponent: string;

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