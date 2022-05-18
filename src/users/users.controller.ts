import { Body, Controller, Delete, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersServices: UsersService) { }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersServices.create(createUserDto);
    return user;
  }

  @Get('existence')
  async determineExistence(@Query() query: any) {
    if (query.username) {
      try {
        const user = await this.usersServices.findByUsername(query.username);
        return Boolean(user);
      } catch (error) {
        console.error(error);
      }
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  async removeById(@Request() res) {
    const userId = res.user.id as number
    const removedUser = await this.usersServices.removeById(userId);
    return removedUser;
  }
}
