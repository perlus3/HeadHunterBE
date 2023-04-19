import { Module } from '@nestjs/common';
import { TypeormImports } from './typeorm';

@Module({
  imports: [...TypeormImports],
  controllers: [],
  providers: [],
})
export class AppModule {}
