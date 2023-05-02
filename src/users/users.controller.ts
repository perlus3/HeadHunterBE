import {Controller, Get, Inject, Param} from '@nestjs/common';
import {UsersService} from "./users.service";
import {OneStudentData} from "../types";

@Controller('users')
export class UsersController {
  constructor(
    @Inject(UsersService) private usersService: UsersService,
  ) {}

  @Get('/available')
  async getListOfAvailableStudents() {
    return await this.usersService.getListOfAvailableStudents();
  }

  @Get('/student/:id')
  async getStudentData(
    @Param('id') id: string
  ): Promise<OneStudentData> {
    return await this.usersService.getStudentData(id);
  }
}
