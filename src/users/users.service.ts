import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import {StudentsEntity, StudentStatus} from '../entities/students-entity';
import { UsersEntity } from '../entities/users.entity';
import { UpdateStudentProfileInfoDto } from '../dtos/update-student-profile-info.dto';
import { ChangeStudentStatusDto } from '../dtos/change-student-status.dto';
import {AvailableStudentData} from "../types/users";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
    @InjectRepository(StudentsEntity)
    private studentProfileRepository: Repository<StudentsEntity>,
  ) {}
  async findOneByEmail(email: string): Promise<UsersEntity> {
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

  async changeStudentStatus(id: string, data: ChangeStudentStatusDto) {
    try {
      const student = await this.getStudentProfileById(id);
      student.status = data.status;

      if (!student.user.isActive) {
        throw new BadRequestException(`Aktywuj najpierw swoje konto ${id}`);
      }

      await this.studentProfileRepository.save(student);
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  async findOneByRegistrationToken(token: string): Promise<UsersEntity> {
    return await this.usersRepository.findOne({
      where: {
        registerToken: token,
      },
    });
  }

  async getUserById(id: string): Promise<UsersEntity> {
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

  async getStudentProfileById(userId: string) {
    return this.studentProfileRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
      relations: ['user'],
    });
  }

  async updateStudentProfile(
    userId: string,
    data: UpdateStudentProfileInfoDto,
  ): Promise<UpdateResult> {
    const { email, ...dataWithoutEmail } = data;
    await this.usersRepository
      .createQueryBuilder()
      .update(UsersEntity)
      .set({
        email,
      })
      .where('id = :id', { id: userId })
      .execute();

    return this.studentProfileRepository
      .createQueryBuilder()
      .update(StudentsEntity)
      .set({
        ...dataWithoutEmail,
      })
      .where('userId = :userId', { userId })
      .execute();
  }

  async getListOfAvailableStudents(): Promise<AvailableStudentData[]> {
    const Students = await this.studentProfileRepository.find({
      select: [
        'firstName',
        'lastName',
        'id',
        'courseCompletion',
        'courseEngagement',
        'projectDegree',
        'teamProjectDegree',
        'expectedTypeWork',
        'targetWorkCity',
        'expectedContractType',
        'expectedSalary',
        'canTakeApprenticeship',
        'monthsOfCommercialExp',
      ],
      where: {
        status: StudentStatus.Available,
      },
    });

    return Students.map(student => {
      const fullName = `${student.firstName} ${student.lastName[0]}.`;
      delete student.firstName;
      delete student.lastName;
      return {
        ...student,
        fullName,
      };
    }) as AvailableStudentData[];
  }
}
