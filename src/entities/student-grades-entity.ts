import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class StudentGradesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  courseCompletion: string;

  @Column()
  courseEngagement: string;

  @Column()
  projectDegree: string;

  @Column()
  teamProjectDegree: string;

  @Column('json')
  bonusProjectUrls: string[];
}
