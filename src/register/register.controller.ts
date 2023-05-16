import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { RegisterService } from './register.service';
import { AddSingleRecruiterDto } from '../dtos/add-single-recruiter.dto';
import { AddStudentsByListDto } from '../dtos/add-students-by-list.dto';
import { MailService } from '../mail/mail.service';
import { SetPasswordDto } from '../dtos/set-password.dto';
import { UsersService } from '../users/users.service';
import { ResendEmailForNewPasswordDto } from '../dtos/resend-email-for-new-password.dto';
import { UserRole } from '../entities/users.entity';
import { Roles } from '../auth/roles/roles.decorator';
import { RoleGuard } from '../auth/role/role.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('register')
export class RegisterController {
  constructor(
    private registerService: RegisterService,
    private mailService: MailService,
    private usersService: UsersService,
  ) {}

  @Post('/list')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(UserRole.Admin)
  async registerManyByList(@Body() data: AddStudentsByListDto[]) {
    await this.registerService.registerManyUsers(data);
    await this.registerService.sendEmailsForUsers(data);
    return { message: 'ok' };
  }

  @Post('/form')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(UserRole.Admin)
  async registerOneByForm(@Body() data: AddSingleRecruiterDto) {
    await this.registerService.registerSingleRecruiter(data);
    return { message: 'ok' };
  }

  @Post('/resend-email')
  async resendEmail(@Body() body: ResendEmailForNewPasswordDto) {
    await this.registerService.resendEmailToSetPassword(body.email);
    return { message: 'wysłano' };
  }

  @Patch('/:id/:registerToken')
  async activateAccount(
    @Param('id') userId: string,
    @Param('registerToken') token: string,
    @Body() data: SetPasswordDto,
  ) {
    const user = await this.usersService.findOneByRegistrationToken(token);
    if (!user) {
      throw new BadRequestException(
        `Nie zarejestrowano użytkownika o podanym tokenie`,
      );
    }
    await this.registerService.setPassword(userId, data.pwd);
    await this.registerService.activateUser(userId);
    return { message: 'ok' };
  }
}
