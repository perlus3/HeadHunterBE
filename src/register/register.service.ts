import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentGradesEntity } from '../entities/student-grades-entity';
import { UserRole, UsersEntity } from '../entities/users.entity';
import {
  checkEmail,
  checkGrade,
  checkLinksToGithub,
} from '../utils/data-validators';
import { RecruitersEntity } from '../entities/recruitersEntity';
import { StudentProfileEntity } from '../entities/student-profile.entity';
import { AddSingleRecruiterDto } from '../dtos/add-single-recruiter.dto';
import { AddStudentsByListDto } from '../dtos/add-students-by-list.dto';
import { UpdateStudentProfileInfoDto } from '../dtos/update-student-profile-info.dto';
import { hashMethod } from '../utils/hash-password';

@Injectable()
export class RegisterService {
  constructor(
    @InjectRepository(StudentGradesEntity)
    private csvUsers: Repository<StudentGradesEntity>,
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
    @InjectRepository(RecruitersEntity)
    private recruitersRepository: Repository<RecruitersEntity>,
    @InjectRepository(StudentProfileEntity)
    private studentProfileRepository: Repository<StudentProfileEntity>,
  ) {}

  async registerManyUsers(data: AddStudentsByListDto[]) {
    try {
      const newUsersGrades: AddStudentsByListDto[] = [];
      const usersData = [];

      for (const row of data) {
        const userGrades = new StudentGradesEntity();

        checkEmail(row.email);

        userGrades.email = row.email;
        checkLinksToGithub(row.bonusProjectUrls);
        userGrades.bonusProjectUrls = row.bonusProjectUrls;
        checkGrade(row.courseCompletion);
        userGrades.courseCompletion = row.courseCompletion;
        checkGrade(row.courseEngagement);
        userGrades.courseEngagement = row.courseEngagement;
        checkGrade(row.projectDegree);
        userGrades.projectDegree = row.projectDegree;
        checkGrade(row.teamProjectDegree);
        userGrades.teamProjectDegree = row.teamProjectDegree;

        newUsersGrades.push(userGrades);
      }

      for (const row of data) {
        const user = new UsersEntity();

        checkEmail(row.email);
        user.email = row.email;
        user.role = UserRole.Student;

        usersData.push(user);
      }

      await this.usersRepository.save(usersData);
      await this.studentProfileRepository.save(newUsersGrades);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          'Nie można dodać dwóch kont z takim samym emailem, podany email może już istnieć w bazie danych',
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

  async registerSingleRecruiter(
    data: AddSingleRecruiterDto,
  ): Promise<RecruitersEntity> {
    try {
      const recruiter = new RecruitersEntity();
      const user = new UsersEntity();

      recruiter.email = data.email;
      recruiter.fullName = data.firstName + ' ' + data.lastName;
      recruiter.company = data.company;
      recruiter.maxReservedStudents = data.maxReservedStudents;

      user.email = data.email;
      user.firstName = data.firstName;
      user.lastName = data.lastName;
      user.role = UserRole.HR;

      await this.usersRepository.save(user);

      return await this.recruitersRepository.save(recruiter);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          'User with that email or login already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (error.statusCode === 500) {
        throw new HttpException(
          'Something went wrong',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async setPassword(userId: string, password: string) {
    const user = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
    });

    user.password = await hashMethod(password);
    user.isActive = true;

    await this.usersRepository.update(userId, user);
    return user.getUser();
  }

  async updateStudentProfile(
    userId: string,
    data: UpdateStudentProfileInfoDto,
  ): Promise<UpdateResult> {
    return this.studentProfileRepository.update(userId, data);
  }
}
