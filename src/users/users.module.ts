import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { RegisterController } from '../register/register.controller';
import { UsersService } from './users.service';
import { RegisterService } from '../register/register.service';
import { MailModule } from '../mail/mail.module';
import { AuthController } from '../auth/auth.controller';
import { AuthService } from '../auth/auth.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { TypeormImports } from '../typeorm';

@Module({
  imports: [...TypeormImports, MailModule],
  controllers: [AuthController, UsersController, RegisterController],
  providers: [AuthService, JwtStrategy, UsersService, RegisterService],
})
export class UsersModule {}
