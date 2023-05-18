import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import dayjs from 'dayjs';

export enum MailTemplate {
  EmailConfirmation = 'email-confirmation',
  ResetPassword = 'reset-password',
  HiredInfo = 'hired-info',
}

@Injectable()
export class MailsService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(
    to: string,
    subject: string,
    template: MailTemplate,
    context: Record<string, any>,
  ) {
    const created = dayjs().format('YYYY-MM-DD HH:mm:ss');

    return this.mailerService.sendMail({
      to,
      subject,
      template,
      context: {
        ...context,
        meta_to: to,
        meta_template: template,
        meta_subject: subject,
        meta_created: created,
      },
    });
  }
}
