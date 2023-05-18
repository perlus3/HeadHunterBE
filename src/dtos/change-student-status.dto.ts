import { StudentStatus } from '../entities/students-entity';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class ChangeStudentStatusDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsEnum(StudentStatus)
  @IsNotEmpty()
  status: StudentStatus;
}
