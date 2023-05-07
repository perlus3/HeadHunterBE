import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentsEntity, StudentStatus } from '../entities/students-entity';
import { UserRole, UsersEntity } from '../entities/users.entity';
import { UpdateStudentProfileInfoDto } from '../dtos/update-student-profile-info.dto';
import { ReservedStudentsEntity } from '../entities/reserved-students.entities';
import { RecruitersEntity } from '../entities/recruiters.entity';
import { Cron } from '@nestjs/schedule';
import dayjs from 'dayjs';
import { MailService } from '../mail/mail.service';

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
    private mailService: MailService,
  ) {}

  async sendInfoToAdminAboutEmployment(hrId: string, studentId: string) {
    const date = dayjs().format('DD.MM.YYYY HH:mm:ss');

    const recruiter = await this.recruitersRepository.findOne({
      where: {
        user: {
          id: hrId,
        },
      },
      relations: ['user'],
    });

    const student = await this.studentProfileRepository.findOne({
      where: {
        user: {
          id: studentId,
        },
      },
      relations: ['user'],
    });

    const adminEmail = await this.usersRepository.findOne({
      select: ['email'],
      where: {
        role: UserRole.Admin,
      },
    });

    await this.mailService.sendMail(
      adminEmail.email,
      `Zatrudniono kursanta ${date}`,
      `Kursant ${student.firstName + student.lastName} (adres email: ${
        student.user.email
      }), został zatrudniony ${date} przez ${recruiter.fullName} z firmy ${
        recruiter.company
      }.`,
    );
  }

  async findOneByEmail(email: string): Promise<UsersEntity> {
    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new HttpException(
        `User with email ${email} does not exist`,
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  @Cron('0 0 * * * *', {
    timeZone: 'Europe/Warsaw',
  })
  async checkStudentsOnReservedList() {
    const today = dayjs().toDate();

    console.log('reserved list checked -', today);

    const reservedStudents = await this.reservedStudentsRepository.find({
      relations: ['student'],
    });

    for (const student of reservedStudents) {
      const studentProfile = await this.studentProfileRepository.findOne({
        where: {
          id: student.student.id,
        },
      });
      if (student.expiresAt < today) {
        studentProfile.status = StudentStatus.Available;
        await this.studentProfileRepository.save(studentProfile);
        await this.reservedStudentsRepository.delete(student.id);
      }
    }
  }

  async changeStudentStatus(
    recruiterId: string,
    studentId: string,
    newStatus: StudentStatus,
  ) {
    try {
      const recruiter = await this.getRecruiterById(recruiterId);
      const student = await this.getStudentProfileById(studentId);
      const studentUser = await this.getUserById(studentId);

      if (!studentUser.isActive) {
        throw new BadRequestException(
          `${studentUser.email} user is deactivated`,
        );
      }
      student.status = newStatus;
      await this.studentProfileRepository.save(student);

      if (student.status === StudentStatus.Hired) {
        await this.sendInfoToAdminAboutEmployment(recruiterId, studentId);
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
        if (reservedStudent) {
          await this.reservedStudentsRepository.delete(reservedStudent.id);
          return { message: 'Student został zatrudniony!' };
        }
      }

      if (student.status === StudentStatus.DuringRecruitment) {
        const reservedUser = new ReservedStudentsEntity();

        reservedUser.student = student;
        reservedUser.recruiter = recruiter;
        reservedUser.expiresAt = dayjs().add(10, 'days').toDate();
        await this.reservedStudentsRepository.save(reservedUser);
        return { expTime: reservedUser.expiresAt };
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
        if (reservedStudent) {
          await this.reservedStudentsRepository.delete(reservedStudent.id);
          return {
            message: 'Student został usunięty z listy zarezerwowanych!',
          };
        }
      }
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          'Podany student już został zapisany na liste oczekujących na rozmowe',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (error.response.statusCode === 400) {
        throw new BadRequestException(`${error.message}`);
      }
      if (error.statusCode === 500) {
        throw new HttpException(
          'Coś poszło nie tak',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
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
  ) {
    try {
      const { email, ...dataWithoutEmail } = data;
      const result = await this.usersRepository
        .createQueryBuilder()
        .update(UsersEntity)
        .set({
          email,
        })
        .where('id = :id', { id: userId })
        .execute();

      const result2 = await this.studentProfileRepository
        .createQueryBuilder()
        .update(StudentsEntity)
        .set({
          ...dataWithoutEmail,
        })
        .where('userId = :userId', { userId })
        .execute();

      if ((result.affected = 1) && (result2.affected = 1)) {
        return { message: 'OK' };
      }
      return { message: 'Nie zaktualizowano profliu studenta' };
    } catch (e) {
      if (e) {
        throw new BadRequestException(`${e.message}`);
      }
    }
  }
}
