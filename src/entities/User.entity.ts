import { BaseEntity, CreateDateColumn, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {AddUserDto} from "../dtos/add-user.dto";

export enum UserRole {
    Admin = 'Admin',
    Student = 'Student',
    HR = 'HR',
}

@Entity({name: 'users'})

export class UserEntity extends BaseEntity implements AddUserDto{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    email: string;

    @Column()
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

    @CreateDateColumn({
        nullable: true,
        type: 'timestamp',
    })
    createdAt: Date;

    getUser(): UserEntity {
        const { ...user } = this;

        return user as unknown as Omit<UserEntity, 'getUser()'>;
    }
}
