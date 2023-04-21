import { Module } from '@nestjs/common';
import { TypeormImports } from './typeorm';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { CsvParser } from 'nest-csv-parser';

@Module({
  imports: [...TypeormImports, CsvParser],
  controllers: [AuthController],
  providers: [AuthService, CsvParser],
})
export class AppModule {}
