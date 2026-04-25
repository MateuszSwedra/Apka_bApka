import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRole } from '../database/entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('auth/register')
  async register(@Body('email') email: string, @Body('password') pass: string) {
    return this.usersService.registerAccount(email, pass);
  }

  @Post('auth/login')
  async login(@Body('email') email: string, @Body('password') pass: string) {
    return this.usersService.login(email, pass);
  }

  @Post(':id/role')
  async setRole(@Param('id') id: string, @Body('role') role: UserRole, @Body('name') name: string) {
    return this.usersService.setRole(id, role, name);
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