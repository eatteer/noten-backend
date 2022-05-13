import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { Category } from 'src/categories/entities/category.entity';
import { UsersModule } from 'src/users/user.module';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [
    UsersModule,
    CategoriesModule,
    TypeOrmModule.forFeature([Category, Note]),
  ],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
