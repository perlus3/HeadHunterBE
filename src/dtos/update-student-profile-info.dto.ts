import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import {
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
  portfolioUrls: string[];

  @IsNotEmpty()
  @IsArray()
  projectUrls: string[];

  @IsOptional()
  @IsString()
  bio: string;

  @IsNotEmpty()
  @IsEnum(ExpectedWorkType)
  expectedTypeWork: ExpectedWorkType;

  @IsNotEmpty()
  @IsString()
  targetWorkCity: string;

  @IsNotEmpty()
  @IsEnum(ExpectedContractType)
  expectedContractType: ExpectedContractType;

  @IsOptional()
  @IsInt()
  expectedSalary: number | null;

  @IsNotEmpty()
  canTakeApprenticeship: boolean;

  @IsNotEmpty()
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

  @IsNotEmpty()
  @IsEnum(StudentStatus)
  status: StudentStatus;
}
