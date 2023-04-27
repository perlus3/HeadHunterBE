import {
  CanTakeApprenticeship,
  ExpectedContractType,
  ExpectedWorkType,
  StudentStatus,
} from '../entities/student-profile.entity';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateStudentProfileInfoDto {
  @IsOptional()
  @IsInt()
  @Min(9)
  tel: number;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  githubUsername: string;

  @IsArray()
  @ArrayNotEmpty()
  portfolioUrls: string[];

  @IsOptional()
  @IsString()
  bio: string;

  @IsOptional()
  @IsEnum({
    enum: ExpectedWorkType,
  })
  expectedTypeWork: ExpectedWorkType;

  @IsOptional()
  @IsString()
  targetWorkCity: string;

  @IsOptional()
  @IsEnum({
    enum: ExpectedContractType,
  })
  expectedContractType: ExpectedContractType;

  @IsOptional()
  @IsInt()
  expectedSalary: number;

  @IsOptional()
  @IsEnum({
    enum: CanTakeApprenticeship,
  })
  canTakeApprenticeship: CanTakeApprenticeship;

  @IsOptional()
  @IsInt()
  monthsOfCommercialExp: number;

  @IsOptional()
  @IsString()
  education: string;

  @IsOptional()
  @IsString()
  workExperience: string;

  @IsOptional()
  @IsString()
  courses: string;

  @IsOptional()
  @IsEnum({
    enum: StudentStatus,
  })
  status: StudentStatus;
}
