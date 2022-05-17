import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './entities/note.entity';

@Injectable()
export class NotesService {
  constructor(
    private usersService: UsersService,
    private categoriesService: CategoriesService,
    @InjectRepository(Note) private notesRepository: Repository<Note>,
  ) {}

  async create(userId: number, createNoteDto: CreateNoteDto) {
    const foundUser = await this.usersService.findById(userId);
    const foundCategory = await this.categoriesService.findById(
      userId,
      createNoteDto.categoryId,
    );
    const newNote = new Note();
    newNote.title = createNoteDto.title;
    newNote.description = createNoteDto.description;
    newNote.category = foundCategory;
    newNote.user = foundUser;
    const createdNote = await this.notesRepository.save(newNote);
    return createdNote;
  }

  async findManyByCategory(userId: number, categoryId: number) {
    const foundNotes = await this.notesRepository
      .createQueryBuilder('note')
      .innerJoinAndSelect('note.category', 'category')
      .where('note.categoryId = :categoryId', { categoryId })
      .andWhere('note.userId = :userId', { userId })
      .getMany();
    return foundNotes;
  }

  async findAll(userId: number) {
    const foundNotes = await this.notesRepository
      .createQueryBuilder('note')
      .innerJoinAndSelect('note.category', 'category')
      .where('note.userId = :userId', {
        userId,
      })
      .getMany();
    return foundNotes;
  }

  async findByKeyword(userId: number, keyword: string) {
    const foundNotes = await this.notesRepository
      .createQueryBuilder('note')
      .innerJoinAndSelect('note.category', 'category')
      .where('note.title like :title', { title: `%${keyword}%` })
      .orWhere('note.description like :description', {
        description: `%${keyword}%`,
      })
      .orWhere('category.name like :name', { name: `%${keyword}%` })
      .having('note.userId = :userId', { userId })
      .getMany();
    return foundNotes;
  }

  async findOne(id: number) {
    const foundNote = await this.notesRepository.findOne(id);
    return foundNote;
  }

  async update(userId: number, id: number, updateNoteDto: UpdateNoteDto) {
    const foundNote = await this.notesRepository.findOne(id);
    foundNote.title = updateNoteDto.title;
    foundNote.description = updateNoteDto.description;
    const foundCategory = await this.categoriesService.findById(
      userId,
      updateNoteDto.categoryId,
    );
    foundNote.category = foundCategory;
    const updatedNote = await this.notesRepository.save(foundNote);
    return updatedNote;
  }

  async remove(id: number) {
    const removedNote = await this.notesRepository.softRemove({ id });
    return removedNote;
  }
}
