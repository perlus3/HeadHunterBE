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
import { ReservedStudentsEntity } from './Reserved.students.entities';

@Entity({ name: 'recruters' })
export class RecruitersEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: true,
  })
  company: string | null;

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
