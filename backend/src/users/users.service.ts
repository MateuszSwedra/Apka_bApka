import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../database/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async registerAccount(email: string, password: string): Promise<User> {
    const existing = await this.usersRepo.findOne({ where: { email } });
    if (existing) throw new BadRequestException('Konto z tym adresem email już istnieje');

    const user = this.usersRepo.create({ email, password });
    return this.usersRepo.save(user);
  }

  async login(email: string, password: string): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user || user.password !== password) {
      throw new UnauthorizedException('Nieprawidłowy email lub hasło');
    }
    return user;
  }

  async setRole(userId: string, role: UserRole, name: string): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    user.role = role;
    user.name = name;

    if (role === UserRole.SENIOR && !user.pairingCode) {
      user.pairingCode = Math.floor(100000 + Math.random() * 900000).toString();
    }

    return this.usersRepo.save(user);
  }

  async pairWithSenior(caregiverId: string, pairingCode: string): Promise<User> {
    const caregiver = await this.usersRepo.findOne({ where: { id: caregiverId }, relations: ['wards'] });
    if (!caregiver) throw new NotFoundException('Caregiver not found');

    const senior = await this.usersRepo.findOne({ where: { pairingCode, role: UserRole.SENIOR } });
    if (!senior) throw new BadRequestException('Nieprawidłowy kod PIN');

    const alreadyPaired = caregiver.wards.some(w => w.id === senior.id);
    if (!alreadyPaired) {
      caregiver.wards.push(senior);
      await this.usersRepo.save(caregiver);
    }
    return senior;
  }

  async getWards(caregiverId: string): Promise<User[]> {
    const caregiver = await this.usersRepo.findOne({ where: { id: caregiverId }, relations: ['wards'] });
    return caregiver ? caregiver.wards : [];
  }
}