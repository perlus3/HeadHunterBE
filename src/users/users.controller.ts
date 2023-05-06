import { Body, Controller, Get, Param, Patch, Req, UseGuards } from "@nestjs/common";
import { UpdateStudentProfileInfoDto } from '../dtos/update-student-profile-info.dto';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

import RequestWithUser from '../utils/interfaces';
import { GetEmailDto } from '../dtos/get-email.dto';
import { ChangeStudentStatusDto } from '../dtos/change-student-status.dto';
import {ReservedStudentsResponse, StudentCvResponse} from "../types";
import {StudentsEntity} from "../entities/students-entity";

@Controller('user')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('/email/:id')
  async getUserEmail(@Param('id') id: string) {
    return this.userService.getUserEmail(id);
  }

  @Get('/student-profile')
  @UseGuards(AuthGuard('jwt'))
  async getStudentProfile(@Req() req: RequestWithUser): Promise<Omit<StudentsEntity, "user">> {
    return this.userService.getStudentProfile(req.user.id);
  }

  @Patch('/update-profile')
  @UseGuards(AuthGuard('jwt'))
  async updateStudentProfile(
    @Body() data: UpdateStudentProfileInfoDto,
    @Req() req: RequestWithUser,
  ) {
    return this.userService.updateStudentProfile(req.user.id, data);
  }

  @Patch('/change-status')
  @UseGuards(AuthGuard('jwt'))
  async changeStudentStatus(
    @Req() req: RequestWithUser,
    @Body() data: ChangeStudentStatusDto,
  ) {
    return this.userService.changeStudentStatus(req.user.id, data);
  }

  @Get('/student-cv/:id')
  getStudentCv(
    @Param('id') id: string
  ): Promise<StudentCvResponse> {
    return this.userService.getStudentCv(id);
  }

  @Get('/reserved-students/:recruiterId')
  @UseGuards(AuthGuard('jwt'))
  getReservedStudentsForRecruiter(@Param('recruiterId') recruiterId: string): Promise<ReservedStudentsResponse[]> {
    return this.userService.getReservedStudentsForRecruiter(recruiterId);
  }
}
