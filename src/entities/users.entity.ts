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
    enum: UserRole,
  })
  role: UserRole;

  @Column({
    nullable: false,
  })
  firstName: string;

  @Column({
    nullable: false,
  })
  lastName: string;

  @Column({
    select: false,
  })
  password: string;

  getUser(): UsersEntity {
    const { ...user } = this;

    return user as unknown as Omit<UsersEntity, 'getUser()'>;
  }
}
