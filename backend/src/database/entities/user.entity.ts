import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { MedicationSchedule } from './medication-schedule.entity';

export enum UserRole {
  CAREGIVER = 'CAREGIVER',
  SENIOR = 'SENIOR',
  INDEPENDENT_SENIOR = 'INDEPENDENT_SENIOR',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'enum', enum: UserRole })
  role!: UserRole;

  @Column({ nullable: true })
  fcmToken!: string;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'caregiver_senior',
    joinColumn: { name: 'caregiver_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'senior_id', referencedColumnName: 'id' },
  })
  wards!: User[];

  @OneToMany(() => MedicationSchedule, (schedule: MedicationSchedule) => schedule.senior)
  schedules!: MedicationSchedule[];
}