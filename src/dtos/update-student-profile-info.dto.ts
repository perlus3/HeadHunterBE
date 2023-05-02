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
import {
  CanTakeApprenticeship,
  ExpectedContractType,
  ExpectedWorkType,
  StudentStatus,
} from '../entities/students-entity';

export class UpdateStudentProfileInfoDto {
  @IsOptional()
  @IsInt()
  @Min(9)
  tel: number;

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
  @IsEnum(ExpectedWorkType)
  expectedTypeWork: ExpectedWorkType;

  @IsOptional()
  @IsString()
  targetWorkCity: string;

  @IsOptional()
  @IsEnum(ExpectedContractType)
  expectedContractType: ExpectedContractType;

  @IsOptional()
  @IsInt()
  expectedSalary: number;

  @IsOptional()
  @IsEnum(CanTakeApprenticeship)
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
  @IsEnum(StudentStatus)
  status: StudentStatus;
}
