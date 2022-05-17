import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = new User();
    newUser.username = createUserDto.username;
    newUser.password = createUserDto.password;

    const createdUser = await this.usersRepository.save(newUser);

    const newCategory = new Category();
    newCategory.name = 'Others';
    newCategory.user = newUser;
    await this.categoriesRepository.save(newCategory);

    return createdUser;
  }

  async findById(id: number) {
    const foundUser = await this.usersRepository.findOne({ where: { id } });
    return foundUser;
  }

  async findByUsername(username: string) {
    const foundUser = await this.usersRepository.findOne({
      where: { username },
    });
    return foundUser;
  }
}
