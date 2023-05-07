import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UpdateStudentProfileInfoDto } from '../dtos/update-student-profile-info.dto';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../utils/interfaces';
import { ChangeStudentStatusDto } from '../dtos/change-student-status.dto';

@Controller('user')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('/email/:id')
  async getUserEmail(@Param('id') id: string) {
    const user = await this.userService.getUserById(id);
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

  @Post('/select-hired')
  @UseGuards(AuthGuard('jwt'))
  async changeStudentStatusButtonForHired(@Req() req: RequestWithUser) {
    await this.userService.changeStudentStatusToHired(req.user.id);
    return { message: 'Zatrudniono!' };
  }

  @Patch('/change-student-status')
  @UseGuards(AuthGuard('jwt'))
  async changeStudentStatusByRecruiter(
    @Body() body: ChangeStudentStatusDto,
    @Req() req: RequestWithUser,
  ) {
    return this.userService.changeStudentStatus(
      req.user.id,
      body.studentId,
      body.status,
    );
  }
}
