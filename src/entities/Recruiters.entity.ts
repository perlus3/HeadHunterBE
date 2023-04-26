import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RecruitersEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    fullName: string;

    @Column({
        nullable: true,
    })
    company: string | null;

    @Column()
    maxReservedStudents: number;
}
