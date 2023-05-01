import { Module } from '@nestjs/common';
import { TypeormImports } from './typeorm';
import { RegisterController } from './register/register.controller';
import { RegisterService } from './register/register.service';
import { MailModule } from './mail/mail.module';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [...TypeormImports, MailModule],
  controllers: [RegisterController, UsersController, AuthController],
  providers: [RegisterService, UsersService, AuthService, JwtStrategy],
})
export class AppModule {}
