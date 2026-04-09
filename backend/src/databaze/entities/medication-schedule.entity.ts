import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { MedicationLog } from './medication-log.entity';

@Entity('medication_schedules')
export class MedicationSchedule {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  dosage!: string;

  @Column()
  cronExpression!: string;

  @ManyToOne(() => User, (user: User) => user.schedules)
  @JoinColumn({ name: 'senior_id' })
  senior!: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  createdBy!: User;

  @OneToMany(() => MedicationLog, (log: MedicationLog) => log.schedule)
  logs!: MedicationLog[];
}