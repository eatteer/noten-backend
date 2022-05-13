import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    private usersService: UsersService,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(userId: number, createCategoryDto: CreateCategoryDto) {
    const user = await this.usersService.findById(userId);
    const category = new Category();
    category.name = createCategoryDto.name;
    category.user = user;
    const savedCategory = await this.categoriesRepository.save(category);
    return savedCategory;
  }

  async findAll(userId: number) {
    const categories = this.categoriesRepository
      .createQueryBuilder('category')
      .where('category.userId = :userId', { userId })
      .getMany();
    return categories;
  }

  async findById(userId: number, categoryId: number) {
    const category = this.categoriesRepository
      .createQueryBuilder('category')
      .where('category.id = :categoryId', { categoryId })
      .andWhere('category.userId = :userId', { userId })
      .getOne();
    return category;
  }

  /* async findByKeyword(userId: string, keyword: string) {
    const categories = this.categoriesRepository
      .createQueryBuilder('category')
      .where('category.name like :name', { name: `%${keyword}%` })
      .andWhere('category.userId = :userId', { userId })
      .getMany();
    return categories;
  } */
}
