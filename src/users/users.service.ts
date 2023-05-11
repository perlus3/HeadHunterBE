import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { StudentsEntity, StudentStatus } from '../entities/students-entity';
import { UserRole, UsersEntity } from '../entities/users.entity';
import { UpdateStudentProfileInfoDto } from '../dtos/update-student-profile-info.dto';
import { ChangeStudentStatusDto } from '../dtos/change-student-status.dto';
import { ReservedStudentsEntity } from '../entities/reserved-students.entities';
import { RecruitersEntity } from '../entities/recruiters.entity';
import { Cron } from '@nestjs/schedule';
import dayjs from 'dayjs';
import { MailService } from '../mail/mail.service';
import { AvailableStudentData } from '../types/users';
import { getUserEmailResponse, ReservedStudentsResponse, StudentCvResponse } from '../types';
import { Command, Console } from 'nestjs-console';
import { checkEmail } from '../utils/data-validators';
import { hashMethod } from '../utils/hash-password';
import {GetListOfReservedStudentsDto, SortCondition, SortOrder} from "../dtos/get-list-of-reserved-students-dto";


@Injectable()
@Console({
  command: 'users',
  description: 'A command to manipulate users entities.',
})
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

  @Cron('0 0 * * * ', {
    timeZone: 'Europe/Warsaw',
  })
  async checkStudentsOnReservedList() {
    const now = dayjs().add(2, 'h').toDate();

    console.log('reserved list checked -', now);

    const reservedStudents = await this.reservedStudentsRepository.find({
      relations: ['student'],
    });

    for (const student of reservedStudents) {
      const studentProfile = await this.studentProfileRepository.findOne({
        where: {
          id: student.student.id,
        },
      });
      if (student.expiresAt < now) {
        studentProfile.status = StudentStatus.Available;
        await this.studentProfileRepository.save(studentProfile);
        await this.reservedStudentsRepository.delete(student.id);
      }
    }
  }

  async checkRecruiterMaxReservedStudents(recruiterId: string) {
    const recruiter = await this.getRecruiterById(recruiterId);

    const recruiterReservedStudents = await this.reservedStudentsRepository
      .createQueryBuilder('reserved')
      .where('reserved.recruiterId = :id', { id: recruiterId })
      .leftJoin('reserved-student.user', 'reserved-user')
      .getCount();
    // console.log(recruiter);
    console.log(recruiterReservedStudents);
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
        return this.changeStudentStatusToHired(studentId);
      }

      if (student.status === StudentStatus.DuringRecruitment) {
        const reservedUser = new ReservedStudentsEntity();

        reservedUser.student = student;
        reservedUser.recruiter = recruiter;
        reservedUser.expiresAt = dayjs().add(10, 'days').toDate();
        await this.reservedStudentsRepository.save(reservedUser);
        // await this.checkRecruiterMaxReservedStudents(recruiterId);
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
      console.log(error);
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

      const reservedStudent = await this.reservedStudentsRepository.findOne({
        where: {
          student: {
            user: {
              id,
            },
          },
        },
      });
      if (reservedStudent) {
        await this.reservedStudentsRepository.delete(reservedStudent.id);
      }
      return { message: 'Student został zatrudniony!' };
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
    } else {
  
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
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
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          'Podany email lub użytkownik github już istnieje w systemie',
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

  async getListOfAvailableStudents(): Promise<AvailableStudentData[]> {
    const Students = await this.studentProfileRepository.find({
      select: [
        'firstName',
        'lastName',
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
      relations: ['user'],
    });

    return Students.map((student) => {
      const fullName = `${student.firstName} ${student.lastName[0]}.`;
      const id = student.user.id;

      delete student.firstName;
      delete student.lastName;
      delete student.user;

      return {
        id,
        ...student,
        fullName,
      };
    }) as AvailableStudentData[];
  }

  async getStudentCv(id: string): Promise<StudentCvResponse> {
    const student = await this.studentProfileRepository.findOne({
      select: [
        'id',
        'firstName',
        'lastName',
        'bio',
        'githubUsername',
        'courseCompletion',
        'courseEngagement',
        'projectDegree',
        'teamProjectDegree',
        'projectUrls',
        'portfolioUrls',
        'bonusProjectUrls',
        'expectedTypeWork',
        'targetWorkCity',
        'expectedContractType',
        'expectedSalary',
        'canTakeApprenticeship',
        'monthsOfCommercialExp',
        'education',
        'workExperience',
      ],
      where: {
        id,
      },
    });

    if (student) {
      return student;
    } else {
      throw new HttpException(
        'Nie znaleziono takiego studenta',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async getUserEmail(id: string): Promise<getUserEmailResponse> {
    const user = await this.getUserById(id);

    if (user) {
      return { email: user.email };
    } else {
      throw new HttpException(
        'Nie znaleziono studenta',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async getStudentProfile(id: string): Promise<Omit<StudentsEntity, "user">> {
    const studentProfile = await this.getStudentProfileById(
      id,
    );
    const { user, ...studentProfileData } = studentProfile;

    return studentProfileData;
  }

  async getReservedStudentsForRecruiter(recruiterId: string, data: GetListOfReservedStudentsDto) {
    const sortBy = data.sortBy ?? SortCondition.ByCourseCompletion;
    const sortOrder = data.sortOrder ?? SortOrder.DESC;
    const {
      courseCompletion,
      courseEngagement,
      projectDegree,
      teamProjectDegree,
      expectedTypeWork,
      targetWorkCity,
      expectedContractType,
      canTakeApprenticeship,
      monthsOfCommercialExp,
    } = data;

    const reservedStudents = await this.reservedStudentsRepository
      .createQueryBuilder('reserved')
      .leftJoin('reserved.student', 'reserved-student')
      .leftJoin('reserved-student.user', 'reserved-user')
      .select([
        'reserved.expiresAt',
        'reserved-student.firstName',
        'reserved-student.lastName',
        'reserved-student.courseCompletion',
        'reserved-student.courseEngagement',
        'reserved-student.projectDegree',
        'reserved-student.teamProjectDegree',
        'reserved-student.expectedTypeWork',
        'reserved-student.targetWorkCity',
        'reserved-student.expectedContractType',
        'reserved-student.expectedSalary',
        'reserved-student.canTakeApprenticeship',
        'reserved-student.monthsOfCommercialExp',
        'reserved-user.id',
      ])
      .where('reserved.recruiterId = :id', {id: recruiterId})
      .andWhere(
        'reserved-student.projectDegree >= :projectDegree' +
        `${courseCompletion ? ' AND reserved-student.courseCompletion >= :courseCompletion' : ''}` +
        `${courseEngagement ? ' AND reserved-student.courseEngagement >= :courseEngagement' : ''}` +
        `${teamProjectDegree ? ' AND reserved-student.teamProjectDegree >= :teamProjectDegree' : ''}` +
        `${expectedTypeWork ? ' AND reserved-student.expectedTypeWork = :expectedTypeWork' : ''}` +
        `${targetWorkCity ? ' AND reserved-student.targetWorkCity = :targetWorkCity' : ''}` +
        `${expectedContractType ? ' AND reserved-student.expectedContractType = :expectedContractType' : ''}` +
        `${monthsOfCommercialExp ? ' AND reserved-student.monthsOfCommercialExp = :monthsOfCommercialExp' : ''}` +
        `${canTakeApprenticeship ? ' AND reserved-student.canTakeApprenticeship = :canTakeApprenticeship' : ''}`,
        {
          projectDegree: projectDegree ?? 0,
          courseCompletion,
          courseEngagement,
          teamProjectDegree,
          expectedTypeWork,
          targetWorkCity,
          expectedContractType,
          canTakeApprenticeship,
          monthsOfCommercialExp,
        })
      .orderBy(sortBy, sortOrder)
      .getMany();

    return reservedStudents.map(reservedStudent => {
      const {expiresAt, student} = reservedStudent;
      const {user} = student;
      delete student.user;

      return {
        id: user.id,
        expiresAt,
        ...student,
      };
    })
  }

  @Command({
    command: 'create-admin <email> <pwd>',
    description: 'Create admin, if there is none.',
  })
  async createAdminCmd(email: string, pwd: string): Promise<number> {
    checkEmail(email);

    try {
      const user = await this.usersRepository.findOne({
        where: {
          role: UserRole.Admin,
        },
      });
      if (user) {
        console.log('Istnieje już konto administratora!');
        return 1;
      }

      const admin = new UsersEntity();
      admin.email = email;
      admin.role = UserRole.Admin;
      admin.isActive = true;
      admin.pwd = await hashMethod(pwd);

      await this.usersRepository.save(admin);
      console.log(`Utworzono konto administratora z adresem email: ${email}`);
      return 0;
    } catch (e) {
      console.log('Wystąpił błąd, proszę spróbować ponownie! ' + e.message);
      return 1;
    }
  }
}
