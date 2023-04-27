import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from '../entities/users.entity';
import { Repository, UpdateResult } from 'typeorm';
import { StudentProfileEntity } from '../entities/student-profile.entity';
import { UpdateStudentProfileInfoDto } from '../dtos/update-student-profile-info.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UsersEntity) private users: Repository<UsersEntity>,
    @InjectRepository(StudentProfileEntity)
    private studentProfileRepository: Repository<StudentProfileEntity>,
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

  async updateStudentProfile(
    userId: string,
    data: UpdateStudentProfileInfoDto,
  ): Promise<UpdateResult> {
    return this.studentProfileRepository.update(userId, data);
  }
}
