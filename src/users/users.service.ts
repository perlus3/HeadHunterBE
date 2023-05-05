import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { StudentsEntity, StudentStatus } from '../entities/students-entity';
import { UsersEntity } from '../entities/users.entity';
import { UpdateStudentProfileInfoDto } from '../dtos/update-student-profile-info.dto';
import { ReservedStudentsEntity } from '../entities/reserved-students.entities';
import { RecruitersEntity } from '../entities/recruiters.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
    @InjectRepository(StudentsEntity)
    private studentProfileRepository: Repository<StudentsEntity>,
    @InjectRepository(ReservedStudentsEntity)
    private reservedStudentsRepository: Repository<ReservedStudentsEntity>,
    @InjectRepository(RecruitersEntity)
    private recruitersRepository: Repository<RecruitersEntity>,
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

  async changeStudentStatus(
    recruiterId: string,
    studentId: string,
    newStatus: StudentStatus,
  ) {
    try {
      const recruiter = await this.getRecruiterById(recruiterId);
      const student = await this.getStudentProfileById(studentId);

      student.status = newStatus;

      if (student.status === StudentStatus.Hired) {
        await this.changeStudentStatusToHired(studentId);
        const reservedStudent = await this.reservedStudentsRepository.findOne({
          where: {
            student: {
              user: {
                id: studentId,
              },
            },
          },
        });

        await this.reservedStudentsRepository.delete(reservedStudent.id);
      }

      if (student.status === StudentStatus.DuringRecruitment) {
        const reservedUser = new ReservedStudentsEntity();

        reservedUser.student = student;
        reservedUser.recruiter = recruiter;

        await this.reservedStudentsRepository.save(reservedUser);
      }

      if (student.status === StudentStatus.Available) {
        const reservedStudent = await this.reservedStudentsRepository.findOne({
          where: {
            student: {
              user: {
                id: studentId,
              },
            },
          },
        });

        await this.reservedStudentsRepository.delete(reservedStudent.id);
      }
      await this.studentProfileRepository.save(student);
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  async changeStudentStatusToHired(id: string) {
    try {
      const student = await this.getStudentProfileById(id);

      if (!student.user.isActive) {
        throw new BadRequestException(`Aktywuj najpierw swoje konto ${id}`);
      }

      student.status = StudentStatus.Hired;

      const newStatus = await this.studentProfileRepository.save(student);

      if (newStatus.status === StudentStatus.Hired) {
        const user = await this.usersRepository.findOne({
          where: {
            id,
          },
        });
        user.isActive = false;
        await this.usersRepository.save(user);
      }
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

  async getRecruiterById(id: string): Promise<RecruitersEntity> {
    const user = await this.recruitersRepository.findOne({
      where: {
        user: {
          id,
        },
      },
    });

    if (user) {
      return user;
    }
    throw new HttpException(
      'Recruiter with this id does not exist',
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
}
