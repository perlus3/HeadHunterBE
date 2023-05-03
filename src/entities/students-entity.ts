import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { UsersEntity } from './users.entity';

export enum ExpectedWorkType {
  Static = 'Na miejscu',
  CanMoveOut = 'Gotowość do przeprowadzki',
  RemoteOnly = 'Wyłącznie zdalnie',
  Hybrid = 'Hybrydowo',
  Any = 'Bez znaczenia',
}

export enum ExpectedContractType {
  UoPOnly = 'Tylko UoP',
  B2B = 'Możliwe B2B',
  UZorUOD = 'Możliwe UZ/UOD',
  Any = 'Brak preferencji',
}

export enum GradingScale {
  Score1 = 1,
  Score2 = 2,
  Score3 = 3,
  Score4 = 4,
  Score5 = 5,
}

export enum StudentStatus {
  Available = 'Dostępny',
  DuringRecruitment = 'W trakcie rozmowy',
  Hired = 'Zatrudniony',
}

@Entity()
export class StudentsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @OneToOne(() => UsersEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: UsersEntity;

  @Column({
    type: 'varchar',
    length: '9',
  })
  tel?: string;

  @Column({
    unique: true,
  })
  githubUsername: string;

  @Column()
  courseCompletion: string;

  @Column()
  courseEngagement: string;

  @Column()
  projectDegree: string;

  @Column()
  teamProjectDegree: string;

  @Column('simple-array')
  portfolioUrls?: string[];

  @Column('simple-array')
  bonusProjectUrls: string[];

  @Column()
  bio?: string;

  @Column({
    type: 'enum',
    enum: ExpectedWorkType,
    default: ExpectedWorkType.Any,
  })
  expectedTypeWork: ExpectedWorkType;

  @Column()
  targetWorkCity?: string;

  @Column({
    type: 'enum',
    enum: ExpectedContractType,
    default: ExpectedContractType.Any,
  })
  expectedContractType: ExpectedContractType;

  @Column()
  expectedSalary?: number;

  @Column({
    default: false,
  })
  canTakeApprenticeship: boolean;

  @Column({
    default: 0,
  })
  monthsOfCommercialExp: number;

  @Column({
    type: 'text',
  })
  education?: string;

  @Column({
    type: 'text',
  })
  workExperience?: string;

  @Column({
    type: 'text',
  })
  courses?: string;

  @Column({
    type: 'enum',
    enum: StudentStatus,
    default: StudentStatus.Available,
  })
  status: StudentStatus;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;
}
