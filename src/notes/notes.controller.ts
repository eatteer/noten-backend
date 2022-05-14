import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  Query,
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
  create(@Request() req, @Body() createNoteDto: CreateNoteDto) {
    const userId = req.user.id;
    return this.notesService.create(userId, createNoteDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Query('categoryId') categoryId: number, @Request() req) {
    const userId = req.user.id;
    if (categoryId) {
      const notes = this.notesService.findManyByCategory(userId, categoryId);
      return notes;
    }
    const notes = await this.notesService.findAll(userId);
    return notes;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    return this.notesService.update(+id, updateNoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notesService.remove(+id);
  }
}
