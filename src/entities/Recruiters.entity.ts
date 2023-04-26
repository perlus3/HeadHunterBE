import {OneToOne, Column, Entity, PrimaryGeneratedColumn, JoinColumn, OneToMany, JoinTable} from 'typeorm';
import { UserEntity } from './User.entity';
import {ReservedStudentsEntities} from "./Reserved.students.entities";

@Entity({name: 'recruters'})
export class RecruiterEntity {
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

    // @OneToMany((type) => ReservedStudentsEntities, (entity) => entity.students.id)
    // @JoinTable()
    // hours: ReservedStudentsEntities[];
}
