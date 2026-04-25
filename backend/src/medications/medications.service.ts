import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicationSchedule } from '../database/entities/medication-schedule.entity';
import { MedicationLog, LogStatus } from '../database/entities/medication-log.entity';
import { User } from '../database/entities/user.entity';

@Injectable()
export class MedicationsService {
  constructor(
    @InjectRepository(MedicationSchedule)
    private readonly scheduleRepo: Repository<MedicationSchedule>,
    @InjectRepository(MedicationLog)
    private readonly logRepo: Repository<MedicationLog>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async markAsTaken(scheduleId: string): Promise<MedicationLog> {
    const schedule = await this.scheduleRepo.findOne({ where: { id: scheduleId } });

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    const log = this.logRepo.create({
      status: LogStatus.TAKEN,
      takenAt: new Date(),
      schedule: schedule,
    });

    return this.logRepo.save(log);
  }

  async getSchedulesForSenior(seniorId: string): Promise<MedicationSchedule[]> {
    return this.scheduleRepo.find({
      where: { senior: { id: seniorId } },
      relations: ['logs'],
    });
  }

  async createSchedule(seniorId: string, name: string, dosage: string, cronExpression: string): Promise<MedicationSchedule> {
    const senior = await this.userRepo.findOne({ where: { id: seniorId } });
    
    if (!senior) {
      throw new NotFoundException('Senior not found');
    }

    const schedule = this.scheduleRepo.create({
      name,
      dosage,
      cronExpression,
      senior,
    });

    return this.scheduleRepo.save(schedule);
  }
}