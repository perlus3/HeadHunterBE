import {Entity, PrimaryGeneratedColumn, ManyToOne, JoinTable, JoinColumn, OneToOne, CreateDateColumn} from 'typeorm';

import {RecruiterEntity} from "./Recruiters.entity";
import {StudentEntity} from "./Student.entity";

@Entity({name: 'reserved_students'})
export class ReservedStudentsEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;async

    @OneToOne(type => StudentEntity)
    @JoinColumn()
    student: StudentEntity;

    @ManyToOne((type) => RecruiterEntity, (entity) => entity.id)
    @JoinTable()
    recruiter: RecruiterEntity;

    @CreateDateColumn({
        nullable: true,
        type: 'timestamp',
    })
    reservedAt: Date;
}
