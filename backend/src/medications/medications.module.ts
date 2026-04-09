import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicationsService } from './medications.service';
import { MedicationsController } from './medications.controller';
import { MedicationSchedule } from '../database/entities/medication-schedule.entity';
import { MedicationLog } from '../database/entities/medication-log.entity';
import { User } from '../database/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MedicationSchedule, MedicationLog, User]),
  ],
  providers: [MedicationsService],
  controllers: [MedicationsController],
  exports: [MedicationsService],
})
export class MedicationsModule {}