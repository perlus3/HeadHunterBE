import {Controller, Get, Inject} from '@nestjs/common';
import {UsersService} from "./users.service";

@Controller('users')
export class UsersController {
  constructor(
    @Inject(UsersService) private usersService: UsersService,
  ) {}

  @Get('/available')
  async getListOfAvailableStudents() {
    return await this.usersService.getListOfAvailableStudents();
  }
}
