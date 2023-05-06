import {BadRequestException, HttpException, HttpStatus, Injectable,} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository, UpdateResult} from 'typeorm';
import {StudentsEntity} from '../entities/students-entity';
import {UsersEntity} from '../entities/users.entity';
import {UpdateStudentProfileInfoDto} from '../dtos/update-student-profile-info.dto';
import {ChangeStudentStatusDto} from '../dtos/change-student-status.dto';
import {getUserEmailResponse, ReservedStudentsResponse, StudentCvResponse} from "../types";
import {ReservedStudentsEntity} from "../entities/reserved-students.entities";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
    @InjectRepository(StudentsEntity)
    private studentProfileRepository: Repository<StudentsEntity>,
    @InjectRepository(ReservedStudentsEntity)
    private reservedStudentsRepository: Repository<ReservedStudentsEntity>,
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
    } else {
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async getStudentProfileById(userId: string) {
    return this.studentProfileRepository.findOne({
      where: {
        id: userId,
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
        'Student with this id does not exist',
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
        'User with this id does not exist',
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

  async getReservedStudentsForRecruiter(recruiterId): Promise<ReservedStudentsResponse[]> {
    const reservedStudents = await this.reservedStudentsRepository.find({
      select: [
        'reservedAt',
      ],
      relations: [
        'student',
        'student.user',
      ],
      where: {
        recruiter: {
          id: recruiterId,
        },
      }
    });

    return reservedStudents.map(reservedStudent  => {
      return {
        id: reservedStudent.student.user.id,
        fullName: reservedStudent.student.firstName + ' ' + reservedStudent.student.lastName,
        courseCompletion: reservedStudent.student.courseCompletion,
        courseEngagement: reservedStudent.student.courseEngagement,
        projectDegree: reservedStudent.student.projectDegree,
        teamProjectDegree: reservedStudent.student.teamProjectDegree,
        expectedTypeWork: reservedStudent.student.expectedTypeWork,
        targetWorkCity: reservedStudent.student.targetWorkCity,
        expectedContractType: reservedStudent.student.expectedContractType,
        expectedSalary: reservedStudent.student.expectedSalary,
        canTakeApprenticeship: reservedStudent.student.canTakeApprenticeship,
        monthsOfCommercialExp: reservedStudent.student.monthsOfCommercialExp,
        reservedUntil: new Date(reservedStudent.reservedAt.setDate(reservedStudent.reservedAt.getDate() + 10)),
      };
    }) as ReservedStudentsResponse[];
  }
}
