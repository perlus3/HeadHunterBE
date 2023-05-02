import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  createConnection,
  getConnection,
  Repository,
  UpdateResult,
} from 'typeorm';
import { UpdateStudentProfileInfoDto } from '../dtos/update-student-profile-info.dto';
import { StudentsEntity } from '../entities/students-entity';
import { UsersEntity } from '../entities/users.entity';
import { compareMethod } from '../utils/hash-password';
import { UpdateUserNamesDto } from '../dtos/update-user-names.dto';
import dataSource from '../config/data-source';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
    @InjectRepository(StudentsEntity)
    private studentProfileRepository: Repository<StudentsEntity>,
  ) {}
  async findOneByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
    });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async findOneByRegistrationToken(token: string) {
    return await this.usersRepository.findOne({
      where: {
        registerToken: token,
      },
    });
  }

  async getUserById(id: string) {
    const user = await this.usersRepository.findOne({
      where: {
        id,
      },
    });

    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  // async updateStudentProfile(
  //   userId: string,
  //   data: UpdateStudentProfileInfoDto,
  // ): Promise<UpdateResult> {
  //   await this.usersRepository.update(userId, names);
  //   return this.studentProfileRepository.update(userId, data);
  // }

  async updateUserNames(
    userId: string,
    names: UpdateUserNamesDto,
  ): Promise<UpdateResult> {
    return this.usersRepository.update(userId, names);
  }

  // async test(userId: string) {
  //   const queryRunner = dataSource.createQueryRunner();
  //
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();
  //
  //   const student = await queryRunner.manager.findOne(StudentsEntity, {
  //     where: {
  //       user: {
  //         id: userId,
  //       },
  //     },
  //     relations: ['user'],
  //   });
  //   console.log(student);
  //
  //   // await queryRunner.manager.save(student);
  //
  //   // Zatwierdź transakcję
  //   await queryRunner.commitTransaction();
  //   await queryRunner.release();
  // }

  async updateStudentAndUser(
    userId: string,
    // firstName: string,
    // lastName: string,
    // info: UpdateStudentProfileInfoDto,
  ) {
    // Znajdź studenta i zaktualizuj dane
    const user = await this.usersRepository.findOne({
      select: ['id', 'email', 'role', 'lastName', 'firstName'],
      where: {
        id: userId,
      },
    });
    // user.firstName = firstName;
    // user.lastName = lastName;
    // await this.usersRepository.save(user);
    console.log(user);

    // Znajdź użytkownika powiązanego z tym studentem i zaktualizuj dane

    const student = await this.studentProfileRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });
    console.log(student);
    // student.tel = info.tel;
    // await this.studentProfileRepository.save(student);
  }
}
