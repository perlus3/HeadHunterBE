import {Entity, PrimaryGeneratedColumn, ManyToOne, JoinTable, JoinColumn, OneToOne} from 'typeorm';
import {StudentsEntity} from "./Student.entity";
import {RecruiterEntity} from "./Recruiters.entity";

@Entity({name: 'reserved_students'})

export class ReservedStudentsEntities {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(type => StudentsEntity)
    @JoinColumn()
    students: StudentsEntity;

    @ManyToOne((type) => RecruiterEntity, (entity) => entity.id)
    @JoinTable()
    recruiter: RecruiterEntity;
}
