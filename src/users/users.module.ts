import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { RegisterController } from '../register/register.controller';
import { UsersService } from './users.service';
import { RegisterService } from '../register/register.service';
import { AuthController } from '../auth/auth.controller';
import { AuthService } from '../auth/auth.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { TypeormImports } from '../typeorm';
import { GithubService } from '../utils/github.service';
import { HttpModule } from '@nestjs/axios';
import { MailsModule } from '../mails/mails.module';
@Module({
  imports: [...TypeormImports, MailsModule, HttpModule],
  controllers: [AuthController, UsersController, RegisterController],
  providers: [
    AuthService,
    JwtStrategy,
    UsersService,
    RegisterService,
    GithubService,
  ],
})
export class UsersModule {}
