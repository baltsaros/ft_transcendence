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
import { User } from "./entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import { DataStorageService } from "src/helpers/data-storage.service";
import { UserRelationDto } from "./dto/user-relation.dto";
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly dataStorage: DataStorageService,
    private eventEmmiter: EventEmitter2,
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
      twoFactorAuth: false,
      secret: "",
      rank: 1000,
      wins: 0,
      loses: 0,
      status: "",
    });
    if (!user) throw new NotImplementedException("Cannot create this user");
    return user;
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findAllFriends(idUser: number) {
    const request = await this.userRepository.findOne({
      relations: {
        friends: true,
      },
      where: { id: idUser },
    });

    return request.friends;
  }

  async getAllInvitations(idUser: number) {
    const request = await this.userRepository.findOne({
      relations: {
        invitations: true,
      },
      where: { id: idUser },
    });

    return request.invitations;
  }

  async findOne(username: string) {
    return await this.userRepository.findOne({
      where: { username: username },
    });
  }

  async findAllOnlineUsers() {
    return await this.userRepository.find({
      where: { status: "online" },
    });
  }

  async findAllOfflineUsers() {
    return await this.userRepository.find({
      where: { status: "offline" },
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
      relations: {
        invitations: true,
        friends: true,
        blocked: true,
      },
    });
    return user;
  }

  async updateElo(IntraId: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { intraId: IntraId },
    });

	if (!user) throw new NotFoundException("User not found");
    const data = await this.userRepository.save(updateUserDto);
    if (!data) throw new NotFoundException("Update failed");
		return data;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id: id },
      relations: {
        invitations: true,
        friends: true,
        blocked: true,
      },
    });
    if (!user) throw new NotFoundException("User not found");
    const data = await this.userRepository.save(updateUserDto);
    if (!data) throw new NotFoundException("Update failed");
    const userUpd = await this.userRepository.findOne({
      where: { id: id },
      relations: {
        invitations: true,
        friends: true,
        blocked: true,
      },
    });
    if (!userUpd) throw new NotFoundException("User not found");
    return userUpd;
  }

  async updateStatus(intraId: number, status: string) {
    const user = await this.findOneByIntraId(intraId);
    if (!user) throw new NotFoundException("User not found");
    user.status = status;
    const data = await this.userRepository.save(user);
    return data;
  }

  async uploadAvatar(id: number, filename: string) {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async incrementWin(id: number) {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!user) throw new NotFoundException("User not found");
    user.wins++;
    const userModified = await this.userRepository.save(user);
    if (!userModified) throw new NotFoundException("User not found");
  }

  async incrementLoss(id: number) {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!user) throw new NotFoundException("User not found");
    user.loses++;
    const userModified = await this.userRepository.save(user);
    if (!userModified) throw new NotFoundException("User not found");
  }

  async removeFriendRelation(friendRelation: UserRelationDto) {
    const request = await this.userRepository.findOne({
      relations: {
        friends: true,
      },
      where: { id: friendRelation.receiverId },
    });

    request.friends = request.friends.filter((user) => {
      return user.id !== friendRelation.senderId;
    });
    const user = await this.userRepository.save(request);
    if (!user) return false;

    const friendUser = await this.userRepository.findOne({
      relations: {
        friends: true,
      },
      where: { id: friendRelation.senderId },
    });
    friendUser.friends = friendUser.friends.filter((friend) => {
      return friend.id !== friendRelation.receiverId;
    });
    const friendOk = await this.userRepository.save(friendUser);
    if (!friendOk) return false;
    const payload = {
      users: [user, friendUser]
    }
    this.eventEmmiter.emit("removeFriend", payload);
    return true;
  }

  async setSecret(secret: string, intraId: number) {
    const user = await this.findOneByIntraId(intraId);
    if (!user) throw new NotFoundException("User not found");
    user.secret = secret;
    const userModified = await this.update(user.id, user);
    return userModified;
  }

  async removeInvitation(invitation: UserRelationDto) {
    const request = await this.userRepository.findOne({
      relations: {
        invitations: true,
      },
      where: { id: invitation.receiverId },
    });

    request.invitations = request.invitations.filter((user) => {
      return user.id !== invitation.senderId;
    });
    const user = await this.userRepository.save(request);
    if (user) return true;
    return false;
  }

  async addFriend(friendRequest: UserRelationDto) {
    const source = await this.userRepository.findOne({
      where: { id: friendRequest.receiverId },
      relations: {
        friends: true,
      },
    });
    if (!source) return false;
    const friend = await this.findOneById(friendRequest.senderId);
    if (!friend) return false;
    source.friends.push(friend);
    const payload = {
      users: [source, friend]
    }
    this.eventEmmiter.emit("addFriend", payload);
    await this.userRepository.save(source);
    return true;
  }

  async acceptInvitation(invitation: UserRelationDto) {
    const source = await this.userRepository.findOne({
      where: {id: invitation.receiverId}, 
      relations: {
        friends: true,
      }
    });
    if (!source) return false;
    if (source.friends.some((item) => item.id === invitation.senderId)) 
    {
      this.removeInvitation(invitation);
      return false;
    }
      return (this.addFriend(invitation) &&
      this.addFriend({
        receiverId: invitation.senderId,
        senderId: invitation.receiverId,
      }) &&
      this.removeInvitation(invitation)
    );
      
  }

  async sendInvitation(friendRequest: UserRelationDto) {
    const source = await this.userRepository.findOne({
      where: { id: friendRequest.receiverId },
      relations: {
        invitations: true,
      },
    });
    const friend = await this.findOneById(friendRequest.senderId);
    console.log(source.invitations)
    if (source.invitations.some((item) => item.id === friendRequest.senderId))
      return (2);
    source.invitations.push(friend);
    const data = {
      username: friend.username,
      status: friend.status,
      socketUsername: source.username,
    }
    const ret = await this.userRepository.save(source);
    if (!ret) return (0);
    this.eventEmmiter.emit("addInvitation", data)
    return (1);

  }

  async blockUser(friendRequest: UserRelationDto) {
    const source = await this.userRepository.findOne({
      where: { id: friendRequest.senderId, },
      relations: {
        blocked: true,
      },
    })
    const friend = await this.findOneById(friendRequest.receiverId);
    source.blocked.push(friend);
    this.eventEmmiter.emit('blockUser', friendRequest);
    await this.userRepository.save(source);
  }

  async getAllBlocked(payload: number) {
    const user = await this.userRepository.findOne({
      where: {id: payload},
      relations: {
        blocked: true,
      },
    })
    return user.blocked;
  }

  async getBlocked(relationBlocked: UserRelationDto)
  {
    const source = await this.userRepository.findOne({
      where: { id: relationBlocked.senderId, },
      relations: {
        blocked: true,
      },
    })
    const blocked = source.blocked.filter((user) => {
      return(user.id === relationBlocked.receiverId)
    })
    if (blocked.length > 0)
      return (true);
    return (false);
  }

  async getFriend(relationFriend: UserRelationDto)
  {
    const source = await this.userRepository.findOne({
      where: { id: relationFriend.senderId, },
      relations: {
        friends: true,
      },
    })
    const friend = source.friends.filter((user) => {
      return(user.id === relationFriend.receiverId)
    })
    if (friend.length > 0)
      return (true);
    return (false);
  }

  async unblockUser(relationBlock: UserRelationDto)
  {
    const source = await this.userRepository.findOne({
      where: { id: relationBlock.senderId },
      relations: {
        blocked: true,
      },
    })
    source.blocked = source.blocked.filter((user) => {
      return (user.id !== relationBlock.receiverId)
    })
    const user = await this.userRepository.save(source);
    if (user)
    {
      this.eventEmmiter.emit('unblockUser', relationBlock);
      return (true);
    }
    return (false);
  }

  // async getBanned(idUser: number)
  // {
  //   // 1. Find all channels where the user has been banned
  //   const source = await this.userRepository.findOne({
  //     where: { id: relationBlock.senderId },
  //     relations: {
  //       blocked: true,
  //     },
  //   })
  //   source.blocked = source.blocked.filter((user) => {
  //     return (user.id !== relationBlock.receiverId)
  //   })
  //   const user = await this.userRepository.save(source);
  //   if (user)
  //   {
  //     this.eventEmmiter.emit('unblockUser', relationBlock);
  //     return (true);
  //   }
  //   return (false);
  // }
}
