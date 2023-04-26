import {OneToOne, Column, Entity, PrimaryGeneratedColumn, JoinColumn, OneToMany, JoinTable} from 'typeorm';
import { UserEntity } from './User.entity';
import {ReservedStudentsEntities} from "./Reserved.students.entities";
import {AddRecruiterDto} from "../dtos/add-recruiter.dto";

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

    @OneToMany((type) => ReservedStudentsEntities, (entity) => entity.students.id)
    @JoinTable()
    hours: ReservedStudentsEntities[];
}
