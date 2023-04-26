import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import {UserEntity} from "./User.entity";

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

    @OneToOne(type => UserEntity)
    @JoinColumn()
    userId: UserEntity;

    @Column({
        nullable: true,
        default: null,
    })
    tel?: number;

    @Column({
        generated: 'uuid',
        nullable: false,
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
    })
    bonusProjectUrls: string[];

    @Column({
        default: null,
    })
    bio?: string;

    @Column({
        type: 'enum',
        enum: ExpectedWorkType,
        default: ExpectedWorkType.Any,
    })
    expectedTypeWork?: ExpectedWorkType;

    @Column({
        default: null,
    })
    targetWorkCity?: string;

    @Column({
        type: 'enum',
        enum: ExpectedContractType,
        default: ExpectedContractType.Any,
    })
    expectedContractType?: ExpectedContractType;

    @Column({
        nullable: true,
        default: null,
    })
    expectedSalary?: number;

    @Column({
        type: 'enum',
        enum: CanTakeApprenticeship,
        default: CanTakeApprenticeship.No,
    })
    canTakeApprenticeship?: CanTakeApprenticeship;

    @Column({
        default: 0,
    })
    monthsOfCommercialExp?: number;

    @Column({
        nullable: true,
        default: null,
    })
    education?: string;

    @Column({
        nullable: true,
        default: null,
    })
    workExperience?: string;

    @Column({
        nullable: true,
        default: null,
    })
    courses?: string;

    @Column({
        type: 'enum',
        enum: StudentStatus,
        default: StudentStatus.Available,
    })
    status?: StudentStatus;
}
