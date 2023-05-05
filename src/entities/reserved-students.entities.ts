import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinTable,
  JoinColumn,
  OneToOne,
  CreateDateColumn,
} from 'typeorm';

import { RecruitersEntity } from './recruiters.entity';
import { StudentsEntity } from './students-entity';

@Entity()
export class ReservedStudentsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => StudentsEntity)
  @JoinColumn()
  student: StudentsEntity;

  @ManyToOne(() => RecruitersEntity, (entity) => entity.id)
  @JoinTable()
  recruiter: RecruitersEntity;

  @CreateDateColumn()
  reservedAt: Date;
}
