import { Column, Entity, IntegerType, PrimaryGeneratedColumn } from 'typeorm';

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
  tel: number | string | null;

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

  @Column({
    nullable: true,
  })
  portfolioUrls: string[] | null;

  @Column()
  projectsUrls: string[];

  @Column()
  bio: string;

  @Column({
    type: 'enum',
    default: ExpectedWorkType.Any,
  })
  expectedTypeWork: ExpectedWorkType;

  @Column()
  targetWorkCity: string;

  @Column({
    type: 'enum',
    default: ExpectedContractType.Any,
  })
  expectedContractType: ExpectedContractType;

  @Column({
    nullable: true,
  })
  expectedSalary: null | number | string;

  @Column({
    default: 'NIE',
  })
  canTakeApprenticeship: 'TAK' | 'NIE';

  @Column({
    default: 0,
  })
  monthsOfCommercialExp: IntegerType;

  @Column({
    nullable: true,
    length: 9999,
  })
  education: string;

  @Column({
    nullable: true,
    length: 9999,
  })
  workExperience: string;

  @Column({
    nullable: true,
    length: 9999,
  })
  courses: string;

  @Column({
    type: 'enum',
    default: StudentStatus.Available,
  })
  status: StudentStatus;
}
