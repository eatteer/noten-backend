import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './entities/note.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note) private notesRepository: Repository<Note>,
  ) {}

  async create(createNoteDto: CreateNoteDto) {
    const note = new Note();
    note.title = createNoteDto.title;
    note.description = createNoteDto.description;
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
