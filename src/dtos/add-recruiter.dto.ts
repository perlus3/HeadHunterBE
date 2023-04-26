import {
    IsEmail,
    IsInt,
    IsNotEmpty,
    IsString,
    Max,
    Min,
} from 'class-validator';

export class AddRecruiterDto {

    @IsString()
    @IsNotEmpty()
    company: string;

    @IsInt()
    @Min(1)
    @Max(999)
    @IsNotEmpty()
    maxReservedStudents: number;
}
