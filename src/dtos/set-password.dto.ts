import { IsNotEmpty, IsString } from 'class-validator';

export class SetPasswordDto {
  @IsString()
  @IsNotEmpty()
  pwd: string;
}
