import {
  BadRequestException,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as argon2 from "argon2";
import { User } from "./entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import { DataStorageService } from "src/helpers/data-storage.service";
import { Profile } from "passport-42";
import { FriendRelationDto } from "./dto/friend-relation.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly dataStorage: DataStorageService
  ) {}

  async create(createUserDto: CreateUserDto) {
    // take care of a case when 42 name is already in the db, but it is a different person
    const existName = await this.userRepository.findOne({
      where: {
        username: createUserDto.username,
      },
    });
    if (existName)
      throw new BadRequestException("User with such a name already exists!");
    const existEmail = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    if (existEmail)
      throw new BadRequestException("User with such an email already exists!");

    const user = await this.userRepository.save({
      username: createUserDto.username,
      email: createUserDto.email,
      intraId: createUserDto.intraId,
      intraToken: createUserDto.intraToken,
      avatar: createUserDto.avatar,
      authentication: true,
      rank: 0,
      wins: 0,
      loses: 0,
      status: "",
    });
    if (!user)
      throw new NotImplementedException("Cannot create this user");
    return user;
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findAllFriends(id: string)
  {
    return await this.userRepository.query(
      ` SELECT * 
        FROM public.user U
        WHERE U.id <> $1
          AND EXISTS(
            SELECT 1
            FROM public.user_friends_user F
            WHERE (F."userId_1" = $1 AND F."userId_2" = U.id )
            OR (F."userId_2" = $1 AND F."userId_1" = U.id )
            );  `,
      [id],
    );
  }

  async getAllInvitations(id: string)
  {
    return await this.userRepository.query(
      ` SELECT * 
        FROM public.user U
        WHERE U.id <> $1
          AND EXISTS(
            SELECT 1
            FROM public.user_invitations_user F
            WHERE (F."userId_1" = $1 AND F."userId_2" = U.id )
            OR (F."userId_2" = $1 AND F."userId_1" = U.id )
            );  `,
      [id],
    );
  }

  async findOne(username: string) {
    return await this.userRepository.findOne({
      where: { username: username },
    });
  }

  async findAllOnlineUsers() {
    return await this.userRepository.find({
      where: { status: "online"},
    });
  }

  async findAllOfflineUsers() {
    return await this.userRepository.find({
      where: { status: "offline"}
    });
  }

  async findOneById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });
    return user;
  }

  async findOneByIntraId(intraId: number) {
    const user = await this.userRepository.findOne({
      where: { intraId: intraId },
    });
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!user) throw new NotFoundException("User not found");
    const data = await this.userRepository.update(id, updateUserDto);
    return data;
  }

  async uploadAvatar(id: number, filename: string) {
    const user = await this.userRepository.findOne({
      where: {id: id},
    });
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async incrementWin(id: number)
  {
    const user = await this.userRepository.findOne({
      where: {id: id},
    });
    if (!user) throw new NotFoundException("User not found");
    user.wins++;
    const userModified = await this.userRepository.save(user);
    if (!userModified) throw new NotFoundException("User not found");
  }

  async incrementLoss(id: number)
  {
    const user = await this.userRepository.findOne({
      where: {id: id},
    });
    if (!user) throw new NotFoundException("User not found");
    user.loses++;
    const userModified = await this.userRepository.save(user);
    if (!userModified) throw new NotFoundException("User not found");
  }

  async removeFriendRelation(friendRelation: FriendRelationDto)
  {
    const request = await this.userRepository.findOne({
      relations: {
        friends: true,
      },
      where: { id: friendRelation.idUser}
    });

    request.friends = request.friends.filter((user) => {
      return (user.id !== friendRelation.idFriend)
    })
    const user = await this.userRepository.save(request);
    if (user) return true;
    return false;
  }

  async removeInvitation(invitation: FriendRelationDto) {
    const request = await this.userRepository.findOne({
      relations: {
        invitations: true,
      },
      where: { id: invitation.idUser}
    });

    request.invitations = request.invitations.filter((user) => {
      return (user.id !== invitation.idFriend)
    })
    const user = await this.userRepository.save(request);
    if (user) return true;
    return false;
  }

  async addFriend(friendRequest: FriendRelationDto)
  {
    const source = await this.userRepository.findOne({
      where: { id: friendRequest.idUser, },
      relations: {
        invitations: true,
        friends: true,
      },
    })
    const friend = await this.findOneById(friendRequest.idFriend);
    source.friends.push(friend);

    await this.userRepository.save(source);
  }
  
  async acceptInvitation(invitation: FriendRelationDto) {
    this.addFriend(invitation);
    this.removeInvitation(invitation);
  }

  async sendInvitation(friendRequest: FriendRelationDto)
  {
    const source = await this.userRepository.findOne({
      where: { id: friendRequest.idUser, },
      relations: {
        invitations: true,
      },
    })
    const friend = await this.findOneById(friendRequest.idFriend);
    source.invitations.push(friend);

    await this.userRepository.save(source);
  }
}
