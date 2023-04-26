import { Module } from '@nestjs/common';
import { TypeormImports } from './typeorm';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [...TypeormImports, MailModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule {}
