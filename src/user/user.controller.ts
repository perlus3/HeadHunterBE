import { Body, Controller, Inject, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { RegisterUser } from 'src/interfaces/user';

@Controller('user')
export class UserController {
  constructor(@Inject(UserService) private userService: UserService) {}

  @Post('/register')
  addUser(@Body() newUser: RegisterDto): Promise<RegisterUser> {
    return this.userService.addUser(newUser);
  }
}
