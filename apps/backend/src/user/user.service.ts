import { BadRequestException, Injectable } from "@nestjs/common";
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
    private readonly dataStorage: DataStorageService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userData: Profile  = this.dataStorage.getData();
    const accessToken = this.dataStorage.getAccessToken();
    console.log("token: " + accessToken);
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
    // const existId = await this.userRepository.findOne({
    //   where: {
    //     intra_id: userData.profile.id,
    //   },
    // });
    // if (existId)
    //   throw new BadRequestException("User with such an intra id already have an account!");
    
    console.log('create profile: ' + userData);
    console.log('create id: ' + userData.intra_id);
    console.log('create avatar: ' + userData.avatar);
    const user = await this.userRepository.save({
      username: createUserDto.username,
      email: createUserDto.email,
      intra_id: userData.intra_id,
      password: await argon2.hash(createUserDto.password),
      authentication: true,
      rank: 0,
      wins: 0,
      loses: 0,
      status: "",
      avatar: userData.avatar,
    });
    console.log('username: ' + user.username);
    console.log('user intra_id: ' + user.intra_id);
    console.log('user avatar: ' + user.avatar);
    const token = this.jwtService.sign({
      username: createUserDto.username,
      email: createUserDto.email,
    });
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

  async findOneById(intra_id: number, profile: Profile, accessToken: string) {
    const user = await this.userRepository.findOne({
      where: { intra_id: intra_id },
    });
    console.log('find by Id: ' + user);
    if (!user)
      this.dataStorage.setData(accessToken, profile);
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
