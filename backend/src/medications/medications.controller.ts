import { Controller, Post, Param, Get, Body } from '@nestjs/common';
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
    return this.medicationsService.getSchedulesForSenior(seniorId);
  }

  @Post('schedule')
  async createSchedule(
    @Body('seniorId') seniorId: string,
    @Body('name') name: string,
    @Body('dosage') dosage: string,
    @Body('cronExpression') cronExpression: string,
  ) {
    return this.medicationsService.createSchedule(seniorId, name, dosage, cronExpression);
  }
}