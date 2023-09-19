import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Channel } from "src/channel/channel.entity";


@Injectable()
export class ChatService {
    constructor(
        @InjectRepository (Channel)
        private readonly channelRepository: Repository<Channel>
    ) {}
    /* 'relations' instructs TypeORM to eagerly load associated entites of the channel entity
    ** so TypeORM will fetch the associated 'user' entities corresponding to the channel entity (array of associated 'user' entities)
    ** TypeORM automatically generates the necessary SQL query with JOIN operations that involve the join table (user_channel) to fetch the associated user data.
    ** TypeORM abstracts away the complexities of the join table.
    */
    async findChannelUser(channelId: number) {
        const channel = await this.channelRepository.findOne({
            where: {id: channelId}, 
            relations: ['users'] });
            const userInChannel = channel.users
            console.log(userInChannel);
            return (userInChannel);
    }

    clientToUser = {}

    join(name: string, clientId: string) {
        this.clientToUser[clientId] = name;

        return Object.values(this.clientToUser); 
    }
}