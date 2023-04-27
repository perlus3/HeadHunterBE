import { Module } from '@nestjs/common';
import { TypeormImports } from './typeorm';
import { RegisterController } from './register/register.controller';
import { RegisterService } from './register/register.service';
import { MailModule } from './mail/mail.module';
import { UserService } from './users/user.service';
import { UserController } from './users/user.controller';

@Module({
  imports: [...TypeormImports, MailModule],
  controllers: [RegisterController, UserController],
  providers: [RegisterService, UserService],
})
export class AppModule {}
