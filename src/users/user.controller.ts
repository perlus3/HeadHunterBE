// tutaj bedziemy uzupełniać profil studenta etc
import { Body, Controller, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateStudentProfileInfoDto } from '../dtos/update-student-profile-info.dto';
import { RequestWithUser } from '../utils/interfaces';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/update-profile')
  async updateStudentProfile(
    @Body() data: UpdateStudentProfileInfoDto,
    @Req() req: RequestWithUser,
  ) {
    console.log(req.user);
    console.log(data);
  }
}
