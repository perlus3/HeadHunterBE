import {
  IsArray,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
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
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsNumber()
  @Min(9)
  tel: string;

  @IsNotEmpty()
  @IsString()
  githubUsername: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsArray()
  portfolioUrls: string[];

  @IsNotEmpty()
  @IsArray()
  bonusProjectUrls: string[];

  @IsOptional()
  @IsString()
  bio: string;

  @IsNotEmpty()
  @IsEnum(ExpectedWorkType)
  expectedTypeWork: ExpectedWorkType;

  @IsOptional()
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
