import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = new User();
    user.username = createUserDto.username;
    user.password = createUserDto.password;
    const savedUser = await this.usersRepository.save(user);
    return savedUser;
  }

  async findById(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    return user;
  }

  async findByUsername(username: string) {
    const user = await this.usersRepository.findOne({ where: { username } });
    return user;
  }
}
