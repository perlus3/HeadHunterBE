import {   BaseEntity, CreateDateColumn, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {AddUserDto} from "../dtos/add-user.dto";

export enum UserRole {
    Admin = 'Admin',
    Student = 'Student',
    HR = 'HR',
}
@Entity({name: 'user'})
export class UsersEntity extends BaseEntity implements AddUserDto{
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

    @CreateDateColumn({
        nullable: true,
        type: 'timestamp',
    })
    createdAt: Date;

    getUser(): UsersEntity {
        const { ...user } = this;

        return user as unknown as Omit<UsersEntity, 'getUser()'>;
    }
}
