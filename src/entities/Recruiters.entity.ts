import { OneToOne, Column, Entity, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { UserEntity } from './User.entity';

@Entity({name: 'recruter'})
export class RecruiterEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    email: string;

    @Column()
    fullName: string;

    @Column({
        nullable: true,
    })
    company: string | null;

    @Column()
    maxReservedStudents: number;

    @OneToOne((type) => UserEntity)
    @JoinColumn()
    user: UserEntity;
}
