import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
  UseGuards,
  Query,
  Put,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('notes')
export class NotesController {
  constructor(private notesService: NotesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Request() req, @Body() createNoteDto: CreateNoteDto) {
    const userId = req.user.id as number;
    const createdNote = await this.notesService.create(userId, createNoteDto);
    return createdNote;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(
    @Query('categoryId') categoryId: number,
    @Query('keyword') keyword: string,
    @Request() req,
  ) {
    const userId = req.user.id as number;
    if (categoryId) {
      const foundNotes = await this.notesService.findManyByCategory(
        userId,
        categoryId,
      );
      return foundNotes;
    }
    if (keyword) {
      const foundNotes = await this.notesService.findByKeyword(userId, keyword);
      return foundNotes;
    }
    const foundNotes = await this.notesService.findAll(userId);
    return foundNotes;
  }

  /* @Get(':id')
  findOne(@Param('id') id: number) {
    return this.notesService.findOne(+id);
  } */

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Request() req,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    const userId = req.user.id as number;
    const updatedNote = await this.notesService.update(
      userId,
      +id,
      updateNoteDto,
    );
    return updatedNote;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: number) {
    const removedNote = this.notesService.remove(+id);
    return removedNote;
  }
}
