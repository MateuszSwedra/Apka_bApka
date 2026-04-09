import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { MedicationSchedule } from './medication-schedule.entity';

export enum LogStatus {
  TAKEN = 'TAKEN',
  MISSED = 'MISSED',
  PENDING = 'PENDING',
}

@Entity('medication_logs')
export class MedicationLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'enum', enum: LogStatus, default: LogStatus.PENDING })
  status!: LogStatus;

  @Column({ type: 'timestamp', nullable: true })
  takenAt!: Date;

  @CreateDateColumn()
  scheduledFor!: Date;

  @ManyToOne(() => MedicationSchedule, (schedule: MedicationSchedule) => schedule.logs)
  @JoinColumn({ name: 'schedule_id' })
  schedule!: MedicationSchedule;
}