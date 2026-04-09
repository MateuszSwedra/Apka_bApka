import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('senior')
  async createSenior(@Body('name') name: string) {
    return this.usersService.createSenior(name);
  }
}