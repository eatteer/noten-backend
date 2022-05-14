import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { Category } from 'src/categories/entities/category.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = new User();
    user.username = createUserDto.username;
    user.password = createUserDto.password;

    const savedUser = await this.usersRepository.save(user);

    const category = new Category();
    category.name = 'Others';
    category.user = user;
    await this.categoriesRepository.save(category);

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
