import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendEmailForNewPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
