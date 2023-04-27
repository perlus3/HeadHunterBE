import {OneToOne, Column, Entity, PrimaryGeneratedColumn, JoinColumn, OneToMany, JoinTable} from 'typeorm';
import { UserEntity } from './User.entity';
import {AddRecruiterDto} from "../dtos/add-recruiter.dto";
import {ReservedStudentsEntity} from "./Reserved.students.entities";

@Entity({name: 'recruters'})

export class RecruiterEntity implements AddRecruiterDto{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        nullable: true,
    })
    company: string | null;

    @Column()
    maxReservedStudents: number;

    @OneToOne((type) => UserEntity)
    @JoinColumn()
    user: UserEntity;

    @OneToMany((type) => ReservedStudentsEntity, (entity) => entity.student.id)
    @JoinTable()
    students: ReservedStudentsEntity[];
}
