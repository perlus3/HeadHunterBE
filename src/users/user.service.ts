import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { UpdateStudentProfileInfoDto } from '../dtos/update-student-profile-info.dto';
import { StudentsEntity } from '../entities/students-entity';
import { UsersEntity } from '../entities/users.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UsersEntity) private users: Repository<UsersEntity>,
    @InjectRepository(StudentsEntity)
    private studentProfileRepository: Repository<StudentsEntity>,
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
