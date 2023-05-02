import { Module } from '@nestjs/common';
import { TypeormImports } from './typeorm';

import { UsersModule } from './users/users.module';

@Module({
  imports: [...TypeormImports, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
