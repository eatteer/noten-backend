import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Get('login')
  async login(@Request() req) {
    /* Issue token and username */
    const response = this.authService.login(req.user);
    return response;
  }
}
