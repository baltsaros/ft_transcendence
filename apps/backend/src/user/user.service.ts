import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as argon2 from "argon2";
import { User } from "./entities/user.entity";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
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
      password: await argon2.hash(createUserDto.password),
      authentication: true,
      rank: 0,
      wins: 0,
      loses: 0,
      status: "",
      avatar: "",
    });
    const token = this.jwtService.sign({username: createUserDto.username, email: createUserDto.email,})
    return { user, token };
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(username: string) {
    return await this.userRepository.findOne({
      where: { username: username },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
