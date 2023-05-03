import { StudentStatus } from '../entities/students-entity';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class ChangeStudentStatusDto {
  @IsEnum(StudentStatus)
  @IsNotEmpty()
  status: StudentStatus;
}
