import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
export class StudentProfileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({
    nullable: true,
  })
  tel: number;

  @Column({
    nullable: false,
  })
  firstName: string;

  @Column({
    nullable: false,
  })
  lastName: string;

  @Column({
    nullable: false,
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

  @Column({
    type: 'json',
    nullable: true,
  })
  portfolioUrls: string[];

  @Column({
    type: 'json',
  })
  projectsUrls: string[];

  @Column()
  bio: string;

  @Column({
    type: 'enum',
    enum: ExpectedWorkType,
    default: ExpectedWorkType.Any,
  })
  expectedTypeWork: ExpectedWorkType;

  @Column()
  targetWorkCity: string;

  @Column({
    type: 'enum',
    enum: ExpectedContractType,
    default: ExpectedContractType.Any,
  })
  expectedContractType: ExpectedContractType;

  @Column({
    nullable: true,
  })
  expectedSalary: number;

  @Column({
    type: 'enum',
    enum: CanTakeApprenticeship,
    default: CanTakeApprenticeship.No,
  })
  canTakeApprenticeship: CanTakeApprenticeship;

  @Column({
    default: 0,
  })
  monthsOfCommercialExp: number;

  @Column({
    nullable: true,
  })
  education: string;

  @Column({
    nullable: true,
  })
  workExperience: string;

  @Column({
    nullable: true,
  })
  courses: string;

  @Column({
    type: 'enum',
    enum: StudentStatus,
    default: StudentStatus.Available,
  })
  status: StudentStatus;
}
