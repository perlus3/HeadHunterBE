import { Body, Controller, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CsvUsersEntity } from '../entities/csv-users.entity';
import { Repository } from 'typeorm';
import { UsersDto } from '../dtos/users.dto';
import { AuthService } from './auth.service';
import { CsvParser } from 'nest-csv-parser';

@Controller('auth')
export class AuthController {
  constructor(
    @InjectRepository(CsvUsersEntity)
    private test: Repository<CsvUsersEntity>,
    private readonly csvParser: CsvParser,
    private authService: AuthService,
  ) {}

  @Post('/register')
  async register(@Body() data: UsersDto[]) {
    return await this.authService.registerByCsv(data);
  }
}
