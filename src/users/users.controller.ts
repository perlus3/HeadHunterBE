import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UpdateStudentProfileInfoDto } from '../dtos/update-student-profile-info.dto';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../utils/interfaces';
import { ChangeStudentStatusDto } from '../dtos/change-student-status.dto';
import {
  AvailableStudentData,
  ReservedStudentsResponse,
  StudentCvResponse,
} from '../types';
import { Roles } from '../auth/roles/roles.decorator';
import { UserRole } from '../entities/users.entity';
import { RoleGuard } from '../auth/role/role.guard';
import { GetListOfStudentsDto } from '../dtos/get-list-of-students-dto';

@Controller('user')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('/email/:id')
  async getUserEmail(@Param('id') id: string) {
    return this.userService.getUserEmail(id);
  }

  @Get('/student-profile')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(UserRole.Student)
  async getStudentProfile(@Req() req: RequestWithUser) {
    const studentProfile = await this.userService.getStudentProfileById(
      req.user.id,
    );
    if (!studentProfile) {
      throw new BadRequestException(`Guard nie wpuści, ale obsługa błędu jest`);
    }
    const { user, ...studentProfileData } = studentProfile;
    return studentProfileData;
  }

  @Patch('/update-profile')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(UserRole.Student)
  async updateStudentProfile(
    @Body() data: UpdateStudentProfileInfoDto,
    @Req() req: RequestWithUser,
  ) {
    return this.userService.updateStudentProfile(req.user.id, data);
  }

  @Patch('/select-hired')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(UserRole.Student)
  async changeStudentStatusButtonForHired(@Req() req: RequestWithUser) {
    return this.userService.changeStudentStatusToHired(req.user.id);
  }

  @Patch('/change-student-status')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(UserRole.HR)
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

  @Get('/available')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(UserRole.HR)
  async getListOfAvailableStudents(
    @Query() data: GetListOfStudentsDto,
  ): Promise<AvailableStudentData[]> {
    return await this.userService.getListOfAvailableStudents(data);
  }

  @Get('/student-cv/:id')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(UserRole.HR)
  async getStudentCv(@Param('id') id: string): Promise<StudentCvResponse> {
    const studentProfile = await this.userService.getStudentProfileById(id);
    const { user, ...StudentCvResponse } = studentProfile;
    return { ...StudentCvResponse, email: user.email };
  }

  @Get('/reserved-students')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(UserRole.HR)
  getReservedStudentsForRecruiter(
    @Req() req: RequestWithUser,
    @Query() data: GetListOfStudentsDto,
  ): Promise<ReservedStudentsResponse[]> {
    return this.userService.getReservedStudentsForRecruiter(req.user.id, data);
  }
}
