import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Request() req, @Body() createCategoryDto: CreateCategoryDto) {
    const usedId = req.user.id;
    const category = await this.categoriesService.create(
      usedId,
      createCategoryDto,
    );
    return category;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findByAll(@Request() req) {
    const usedId = req.user.id;
    const categories = await this.categoriesService.findAll(usedId);
    return categories;
  }

  /* @UseGuards(AuthGuard('jwt'))
  @Get()
  async findByKeyword(@Request() req, @Query('keyword') keyword: string) {
    const usedId = req.user.id;
    const categories = await this.categoriesService.findByKeyword(
      usedId,
      keyword,
    );
    return categories;
  } */
}
