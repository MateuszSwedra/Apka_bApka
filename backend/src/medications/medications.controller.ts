import { Controller, Post, Param, Get } from '@nestjs/common';
import { MedicationsService } from './medications.service';

@Controller('medications')
export class MedicationsController {
  constructor(private readonly medicationsService: MedicationsService) {}

  @Post(':scheduleId/take')
  async takeMedication(@Param('scheduleId') scheduleId: string) {
    return this.medicationsService.markAsTaken(scheduleId);
  }

  @Get('senior/:seniorId')
  async getSchedules(@Param('seniorId') seniorId: string) {
    return this.medicationsService.getSeniorSchedules(seniorId);
  }
}