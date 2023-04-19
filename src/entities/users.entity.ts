import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  Admin = 'Admin',
  Student = 'Student',
  HR = 'HR',
}
@Entity()
export class UsersEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({
    default: false,
  })
  isActive: boolean;

  @Column({
    type: 'enum',
  })
  role: UserRole;

  @Column({
    nullable: false,
  })
  fullName: string;

  @Column({
    select: false,
  })
  password: string;

  @Column({
    nullable: true,
  })
  company?: string | null;

  @Column()
  maxReservedStudents: number;

  getUser(): UsersEntity {
    const { ...user } = this;

    return user as unknown as Omit<UsersEntity, 'getUser()'>;
  }
}
