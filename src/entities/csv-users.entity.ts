import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CsvUsersEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  courseCompletion: string;

  @Column()
  courseEngagement: string;

  @Column()
  projectDegree: string;

  @Column()
  teamProjectDegree: string;

  @Column()
  bonusProjectUrls: string;

  // constructor(partial: Partial<CsvUsersEntity>) {
  //   Object.assign(this, partial);
  // }
}
