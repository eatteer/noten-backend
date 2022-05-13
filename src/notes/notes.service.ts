import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { Category } from 'src/categories/entities/category.entity';
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
    const user = await this.usersService.findById(userId);
    const category = await this.categoriesService.findById(
      userId,
      createNoteDto.categoryId,
    );
    const note = new Note();
    note.title = createNoteDto.title;
    note.description = createNoteDto.description;
    note.category = category;
    note.user = user;
    const createdNote = await this.notesRepository.save(note);
    return createdNote;
  }

  async findAll() {
    const notes = await this.notesRepository.find();
    return notes;
  }

  async findOne(id: number) {
    const note = await this.notesRepository.findOne(id);
    return note;
  }

  update(id: number, updateNoteDto: UpdateNoteDto) {
    return `This action updates a #${id} note`;
  }

  async remove(id: number) {
    const deletedPartialNote = await this.notesRepository.softRemove({ id });
    return deletedPartialNote;
  }
}
