import {
    ArrayNotEmpty,
    IsArray,
    IsEmail,
    IsNotEmpty,
    IsString,
} from 'class-validator';

export class AddStudentsByListDto {
    @IsEmail()
    @IsNotEmpty()
    email?: string;

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

    @IsArray()
    @ArrayNotEmpty()
    bonusProjectUrls: string[];
}
