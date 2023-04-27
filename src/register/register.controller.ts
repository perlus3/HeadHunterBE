import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common';

import { RegisterService } from './register.service';
import { AddSingleRecruiterDto } from '../dtos/add-single-recruiter.dto';
import { AddStudentsByListDto } from '../dtos/add-students-by-list.dto';
import { MailService } from '../mail/mail.service';
import { UsersService } from '../users/users.service';
import { PasswordDto } from '../dtos/password.dto';

@Controller('register')
export class RegisterController {
  constructor(
    private registerService: RegisterService,
    private mailService: MailService,
    private usersService: UsersService,
  ) {}

  @Post('/list')
  async registerManyByList(@Body() data: AddStudentsByListDto[]) {
    return await this.registerService.registerManyUsers(data);
  }

  @Post('/form')
  async registerOneByForm(@Body() data: AddSingleRecruiterDto) {
    await this.registerService.registerSingleRecruiter(data);

    const user = await this.usersService.findOneByEmail(data.email);

    await this.mailService.sendMail(
      data.email,
      'AKTYWUJ KONTO NA PLATFORMIE HEADHUNTERS by MegaK',
      `Aby dokończyć rejestracje na platformie HEADHUNTERS by MegaK musisz kliknąć w ten link ( localhost:3000/register/${user.id}/${user.registerToken} ) `,
    );
    return user;
  }

  @Post('/:id/:registerToken')
  async activateAccount(
    @Param('id') userId: string,
    @Param('registerToken') token: string,
    @Body() password: PasswordDto,
  ) {
    const user = await this.usersService.findOneByRegistrationToken(token);
    if (!user) {
      throw new BadRequestException(
        `Nie zarejestrowano użytkownika o podanym tokenie`,
      );
    }
    await this.registerService.setPassword(userId, password.pwd);
    return user;
  }
}
