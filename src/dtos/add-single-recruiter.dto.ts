import {
    IsEmail,
    IsInt,
    IsNotEmpty,
    IsString,
    Max,
    Min,
} from 'class-validator';

export class AddSingleRecruiterDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    company: string;

    @IsInt()
    @Min(1)
    @Max(999)
    @IsNotEmpty()
    maxReservedStudents: number;
}
