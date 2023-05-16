import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsNotEmpty, IsNumber,
  IsString,
} from 'class-validator';

export class AddStudentsByListDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  courseCompletion: number;

  @IsString()
  @IsNotEmpty()
  courseEngagement: number;

  @IsNumber()
  @IsNotEmpty()
  projectDegree: number;

  @IsNumber()
  @IsNotEmpty()
  teamProjectDegree: number;

  @IsArray()
  @ArrayNotEmpty()
  bonusProjectUrls: string[];
}
