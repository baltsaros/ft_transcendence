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

  findAll() {
    return `This action returns all user`;
  }

  async findOne(username: string) {
    return await this.userRepository.findOne({
      where: { username: username },
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
}
