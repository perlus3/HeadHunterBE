import { IsNotEmpty, IsString } from 'class-validator';
export class UsersDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  bonusProjectUrls: string;

  @IsString()
  @IsNotEmpty()
  courseCompletion: string;

  @IsString()
  @IsNotEmpty()
  courseEngagement: string;

  @IsString()
  @IsNotEmpty()
  projectDegree: string;

  @IsString()
  @IsNotEmpty()
  teamProjectDegree: string;
}
