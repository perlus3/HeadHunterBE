import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AlreadyTakenEmailAdr,
  RegisterUser,
  WrongEmailAdr,
} from 'src/interfaces/user';
import { Repository } from 'typeorm';
import { UsersEntity } from 'src/entities/users.entity';
import { RegisterDto } from './dto/register.dto';
import { hashPwd } from 'src/utils/hash-pwd';

@Injectable()
export class UserService {
  filter(user: UsersEntity): any {
    const { id, email } = user;
    return { id, email };
  }
  constructor(
    @InjectRepository(UsersEntity)
    private UserRepository: Repository<UsersEntity>,
  ) {}

  async addUser(newUser: RegisterDto): Promise<RegisterUser> {
    const newMember = new UsersEntity();
    newMember.email = newUser.email;
    newMember.pwdHash = hashPwd(newUser.pwd);
    const findByEmail = await this.UserRepository.find({
      where: {
        email: newUser.email,
      },
    });
    console.log(await findByEmail);
    if ((await findByEmail).length !== 0) {
      return {
        isSuccess: false,
        isNewEmail: false,
      };
    }

    if (!newUser.email.includes('@')) {
      return { isEmail: false };
    }

    await this.UserRepository.save(newMember);
    return this.filter(newMember);
  }
}
