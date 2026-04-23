import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRole } from '../database/entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body('role') role: UserRole, @Body('name') name: string) {
    return this.usersService.register(role, name);
  }

  @Post('pair')
  async pairSenior(@Body('caregiverId') caregiverId: string, @Body('pairingCode') pairingCode: string) {
    return this.usersService.pairWithSenior(caregiverId, pairingCode);
  }

  @Get(':id/wards')
  async getWards(@Param('id') id: string) {
    return this.usersService.getWards(id);
  }
}