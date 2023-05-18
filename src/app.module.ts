import { Module } from '@nestjs/common';
import { TypeormImports } from './typeorm';

import { UsersModule } from './users/users.module';
import { ConsoleModule } from 'nestjs-console';
import { ScheduleModule } from '@nestjs/schedule';


@Module({
  imports: [
    ...TypeormImports,
    UsersModule,
    ConsoleModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
