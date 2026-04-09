import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../database/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async createSenior(name: string): Promise<User> {
    const senior = this.usersRepo.create({
      name,
      role: UserRole.SENIOR,
    });
    return this.usersRepo.save(senior);
  }
}