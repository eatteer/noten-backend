import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from 'src/notes/entities/note.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    private usersService: UsersService,
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(userId: number, createCategoryDto: CreateCategoryDto) {
    const foundUser = await this.usersService.findById(userId);
    const newCategory = new Category();
    newCategory.name = createCategoryDto.name;
    newCategory.user = foundUser;
    const createdCategory = await this.categoriesRepository.save(newCategory);
    return createdCategory;
  }

  async findAll(userId: number) {
    const foundCategories = this.categoriesRepository
      .createQueryBuilder('category')
      .where('category.userId = :userId', { userId })
      .orderBy('category.id', 'ASC')
      .getMany();
    return foundCategories;
  }

  async findById(userId: number, categoryId: number) {
    const foundCategories = this.categoriesRepository
      .createQueryBuilder('category')
      .where('category.id = :categoryId', { categoryId })
      .andWhere('category.userId = :userId', { userId })
      .getOne();
    return foundCategories;
  }

  async remove(userId: number, categoryId: number) {
    const foundCategory = await this.categoriesRepository.findOne({
      relations: ['notes'],
      where: {
        id: categoryId,
      },
    });

    const defaultCategory = await this.categoriesRepository
      .createQueryBuilder('category')
      .innerJoinAndSelect('category.user', 'user')
      .where('category.id = :categoryId', { categoryId })
      .where('user.id = :userId', { userId })
      .getOne();

    if (foundCategory.notes.length > 0) {
      foundCategory.notes.forEach(async (note) => {
        note.category = defaultCategory;
        await this.notesRepository.save(note);
      });
    }

    const removedCategory = await this.categoriesRepository.softRemove(
      foundCategory,
    );

    return removedCategory;
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
