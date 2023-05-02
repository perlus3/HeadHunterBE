import {
  CreateDateColumn,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';
import { Exclude } from 'class-transformer';

export enum UserRole {
  Admin = 'Admin',
  Student = 'Student',
  HR = 'HR',
}

@Entity()
export class UsersEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
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

  @Column()
  pwd: string;

  @Column({
    generated: 'uuid',
    unique: true,
  })
  registerToken: string;

  @Column({
    nullable: true,
    default: null,
  })
  currentTokenId: string | null;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  getUser(): UsersEntity {
    const { ...user } = this;

    return user as unknown as Omit<UsersEntity, 'getUser()'>;
  }
}
