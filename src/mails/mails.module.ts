import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { MailsService } from './mails.service';
import { config } from '../config/config';

const TEMPLATE_DIR = __dirname + '/templates/';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: config.HOST_SMTP,
        secure: true,
        auth: {
          user: config.USER_NAME_SMTP,
          pass: config.USER_PASSWORD_SMTP,
        },
      },
      defaults: {
        from: config.EMAIL_SEND_FROM_SMTP,
      },
      template: {
        dir: TEMPLATE_DIR,
        adapter: new EjsAdapter({
          inlineCssEnabled: true,
        }),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailsService],
  exports: [MailsService],
})
export class MailsModule {}
