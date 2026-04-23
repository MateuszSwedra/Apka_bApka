import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../database/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async register(role: UserRole, name: string): Promise<User> {
    // Poprawka: Jawnie określamy typ jako string lub undefined
    let pairingCode: string | undefined = undefined;
    
    if (role === UserRole.SENIOR) {
      pairingCode = Math.floor(100000 + Math.random() * 900000).toString();
    }

    const user = this.usersRepo.create({
      name,
      role,
      pairingCode,
    });
    
    return this.usersRepo.save(user);
  }

  async pairWithSenior(caregiverId: string, pairingCode: string): Promise<User> {
    const caregiver = await this.usersRepo.findOne({
      where: { id: caregiverId },
      relations: ['wards'],
    });

    if (!caregiver) {
      throw new NotFoundException('Caregiver not found');
    }

    const senior = await this.usersRepo.findOne({
      where: { pairingCode, role: UserRole.SENIOR },
    });

    if (!senior) {
      throw new BadRequestException('Invalid pairing code');
    }

    const alreadyPaired = caregiver.wards.some(w => w.id === senior.id);
    if (!alreadyPaired) {
      caregiver.wards.push(senior);
      await this.usersRepo.save(caregiver);
    }

    return senior;
  }

  async getWards(caregiverId: string): Promise<User[]> {
    const caregiver = await this.usersRepo.findOne({
      where: { id: caregiverId },
      relations: ['wards'],
    });
    return caregiver ? caregiver.wards : [];
  }
}