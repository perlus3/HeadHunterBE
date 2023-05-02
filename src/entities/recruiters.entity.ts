import {
  OneToOne,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { UsersEntity } from './users.entity';
import { ReservedStudentsEntity } from './reserved-students.entities';

@Entity()
export class RecruitersEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  company: string;

  @Column()
  fullName: string;

  @Column()
  maxReservedStudents: number;

  @OneToOne(() => UsersEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: UsersEntity;

  @OneToMany(() => ReservedStudentsEntity, (entity) => entity.student.id)
  @JoinTable()
  students: ReservedStudentsEntity[];
}
