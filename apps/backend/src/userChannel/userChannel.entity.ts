import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { Channels } from "src/channels/entities/channels.entity";

/* This entity will be used to identify the users that belong to a channel */
@Entity()
export class userChannel {
    @PrimaryGeneratedColumn()
    id: number;

    // Many UserChannel can be associated with one user
    @ManyToOne(() => User, user => user.userChannels) // target entity for the relation, function for the invers side of the relation
    user: User; // access the user entity within UserChannel

    // Many UserChannel can be associated with one channel
    @ManyToOne(() => Channels, channels => channels.owner) // inverse side, from perspective of channel entity
    channels: Channels
}
