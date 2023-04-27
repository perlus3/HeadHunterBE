import { Module } from '@nestjs/common';
import { TypeormImports } from './typeorm';
import { RegisterController } from './register/register.controller';
import { RegisterService } from './register/register.service';
import { MailModule } from './mail/mail.module';
import { UsersService } from './users/users.service';

@Module({
  imports: [...TypeormImports, MailModule],
  controllers: [RegisterController],
  providers: [RegisterService, UsersService],
})
export class AppModule {}
