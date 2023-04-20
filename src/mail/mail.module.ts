import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import mailerconfig from 'src/mailerconfig';

@Module({
  imports: [MailerModule.forRoot(mailerconfig)],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
