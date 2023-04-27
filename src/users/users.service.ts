import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from '../entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity) private users: Repository<UsersEntity>,
  ) {}
  async findOneByEmail(email: string) {
    return await this.users.findOne({
      where: {
        email,
      },
    });
  }
  async findOneByRegistrationToken(token: string) {
    return await this.users.findOne({
      where: {
        registerToken: token,
      },
    });
  }
}
