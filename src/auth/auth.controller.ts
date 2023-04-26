import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AddSingleRecruiterDto } from '../dtos/add-single-recruiter.dto';
import { AddStudentsByListDto } from '../dtos/add-students-by-list.dto';
import { MailService } from '../mail/mail.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private mailService: MailService,
  ) {}

  @Post('/register/list')
  async registerManyByList(@Body() data: AddStudentsByListDto[]) {
    return await this.authService.registerManyUsers(data);
  }

  @Post('/register/form')
  async registerOneByForm(@Body() data: AddSingleRecruiterDto) {
    await this.mailService.sendMail(
      data.email,
      'HELLO WORLD',
      'www.google.com',
    );
    return await this.authService.registerSingleRecruiter(data);
  }

  // @Post('/register/complete-profile')
  // async completeProfile(@Body() data: StudentProfileDto) {
  //   return await this.
  // }
}
