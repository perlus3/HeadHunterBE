import { Body, Controller, Inject, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendMailDto } from '../dtos/send-mail.dto';

@Controller('/mail')
export class MailController {
  constructor(@Inject(MailService) private mailService: MailService) {}

  @Post('/')
  async sendMail(@Body() message: SendMailDto): Promise<any> {
    return this.mailService.sendMail(
      message.email,
      message.subject,
      message.description,
    );
  }
}
