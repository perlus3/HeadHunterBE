import { Module } from '@nestjs/common';
import { RoleGuard } from './role/role.guard';

@Module({
  providers: [RoleGuard],
})
export class AuthModule {}
