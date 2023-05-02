// tutaj bedziemy uzupełniać profil studenta etc
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UpdateStudentProfileInfoDto } from '../dtos/update-student-profile-info.dto';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { UserObj } from '../decorators/user-obj.decorator';
import { UsersEntity } from '../entities/users.entity';
// import { RequestWithUser } from '../utils/interfaces';

@Controller('user')
export class UsersController {
  constructor(private userService: UsersService) {}

  // @Post('/update-profile')
  // @UseGuards(AuthGuard('jwt'))
  // async updateStudentProfile(
  //   @Body() data: UpdateStudentProfileInfoDto,
  //   @UserObj() user: UsersEntity,
  // ) {
  //   await this.userService.updateUserNames(user.id, {
  //     ...data,
  //   });
  //   await this.userService.updateStudentProfile(user.id, data);
  // }

  @Post('/test')
  @UseGuards(AuthGuard('jwt'))
  async test(@UserObj() user: UsersEntity) {
    await this.userService.updateStudentAndUser(user.id);
  }
}
