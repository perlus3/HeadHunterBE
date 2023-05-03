import { IsNotEmpty, IsString } from 'class-validator';

export class GetEmailDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
