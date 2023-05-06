import { Module } from '@nestjs/common';
import { TypeormImports } from './typeorm';

import { UsersModule } from './users/users.module';
import {ConsoleModule} from "nestjs-console";

@Module({
  imports: [
    ...TypeormImports,
    UsersModule,
    ConsoleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
