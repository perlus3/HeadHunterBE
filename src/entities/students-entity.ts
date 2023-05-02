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
  Score1 = '1 / 5',
  Score2 = '2 / 5',
  Score3 = '3 / 5',
  Score4 = '4 / 5',
  Score5 = '5 / 5',
}

export enum CanTakeApprenticeship {
  Yes = 'TAK',
  No = 'NIE',
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
    nullable: true,
    default: null,
  })
  tel?: number;

  @Column({
    unique: true,
  })
  githubUsername?: string;

  @Column()
  courseCompletion: string;

  @Column()
  courseEngagement: string;

  @Column()
  projectDegree: string;

  @Column()
  teamProjectDegree: string;

  @Column({
    type: 'json',
    nullable: true,
  })
  portfolioUrls: string[];

  @Column({
    type: 'json',
    nullable: true,
  })
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

  @Column({
    default: null,
  })
  expectedSalary?: number;

  @Column()
  canTakeApprenticeship: boolean;

  @Column({
    default: 0,
  })
  monthsOfCommercialExp: number;

  @Column({
    nullable: true,
    type: 'text',
  })
  education?: string;

  @Column({
    nullable: true,
    default: null,
    type: 'text',
  })
  workExperience?: string;

  @Column({
    default: null,
    type: 'text',
  })
  courses?: string;

  @Column({
    type: 'enum',
    enum: StudentStatus,
    default: StudentStatus.Available,
  })
  status?: StudentStatus;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;
}
