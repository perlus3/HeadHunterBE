import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UpdateStudentProfileInfoDto } from '../dtos/update-student-profile-info.dto';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

import RequestWithUser from '../utils/interfaces';
import { GetEmailDto } from '../dtos/get-email.dto';
import { ChangeStudentStatusDto } from '../dtos/change-student-status.dto';

@Controller('user')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('/email')
  async getUserEmail(@Body() data: GetEmailDto) {
    const user = await this.userService.getUserById(data.id);
    return { email: user.email };
  }

  @Get('/student-profile')
  @UseGuards(AuthGuard('jwt'))
  async getStudentProfile(@Req() req: RequestWithUser) {
    const studentProfile = await this.userService.getStudentProfileById(
      req.user.id,
    );
    const { user, ...studentProfileData } = studentProfile;
    return studentProfileData;
  }

  @Patch('/update-profile')
  @UseGuards(AuthGuard('jwt'))
  async updateStudentProfile(
    @Body() data: UpdateStudentProfileInfoDto,
    @Req() req: RequestWithUser,
  ) {
    return this.userService.updateStudentProfile(req.user.id, data);
  }

  @Patch('/change-status/:id')
  async changeStudentStatus(
    @Param('id') id: string,
    @Body() data: ChangeStudentStatusDto,
  ) {
    return this.userService.changeStudentStatus(id, data);
  }
}
