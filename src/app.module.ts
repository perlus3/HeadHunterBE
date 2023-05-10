import { Module } from '@nestjs/common';
import { TypeormImports } from './typeorm';

import { UsersModule } from './users/users.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [...TypeormImports, UsersModule, ScheduleModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
