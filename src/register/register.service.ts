import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  checkEmail,
  checkGrade,
  checkLinksToGithub,
} from '../utils/data-validators';
import { AddSingleRecruiterDto } from '../dtos/add-single-recruiter.dto';
import { AddStudentsByListDto } from '../dtos/add-students-by-list.dto';
import { hashMethod } from '../utils/hash-password';
import { MailService } from '../mail/mail.service';
import { UsersService } from '../users/users.service';
import { RecruitersEntity } from '../entities/recruiters.entity';
import { StudentsEntity } from '../entities/students-entity';
import { UserRole, UsersEntity } from '../entities/users.entity';
import { config } from '../config/config';
import { randomUUID } from 'crypto';

@Injectable()
export class RegisterService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
    @InjectRepository(RecruitersEntity)
    private recruitersRepository: Repository<RecruitersEntity>,
    @InjectRepository(StudentsEntity)
    private studentProfileRepository: Repository<StudentsEntity>,
    private mailService: MailService,
    private usersService: UsersService,
  ) {}

  async sendEmailsForUsers(data: AddStudentsByListDto[]) {
    for (const student of data) {
      const user = await this.usersService.findOneByEmail(student.email);
      await this.mailService.sendMail(
        student.email,
        'AKTYWUJ KONTO NA PLATFORMIE HEADHUNTERS by MegaK',
        `Aby dokończyć rejestrację na platformie HEADHUNTERS by MegaK, kliknij w ten link: ${config.APP_DOMAIN}/register/${user.id}/${user.registerToken}.`,
      );
    }
  }

  async resendEmailToSetPassword(email: string) {
    const user = await this.usersService.findOneByEmail(email);
    await this.mailService.sendMail(
      email,
      'USTAW NOWE HASŁO NA PLATFORMIE HEADHUNTERS by MegaK',
      `Aby ustawić hasło na platformie HEADHUNTERS by MegaK, kliknij w ten link: ${config.APP_DOMAIN}/new-password/${user.id}/${user.registerToken}.`,
    );
  }

  async registerManyUsers(data: AddStudentsByListDto[]) {
    try {
      const newStudentGrades = [];
      const usersData = [];

      for (const row of data) {
        const studentProfile = new StudentsEntity();
        const user = new UsersEntity();

        checkEmail(row.email);
        user.email = row.email;
        user.role = UserRole.Student;

        usersData.push(user);

        studentProfile.user = user;
        checkLinksToGithub(row.bonusProjectUrls);
        studentProfile.bonusProjectUrls = row.bonusProjectUrls;
        checkGrade(row.courseCompletion);
        studentProfile.courseCompletion = row.courseCompletion;
        checkGrade(row.courseEngagement);
        studentProfile.courseEngagement = row.courseEngagement;
        checkGrade(row.projectDegree);
        studentProfile.projectDegree = row.projectDegree;
        checkGrade(row.teamProjectDegree);
        studentProfile.teamProjectDegree = row.teamProjectDegree;
        studentProfile.githubUsername = `PrzykładowyGitHubUser-${randomUUID()}`;

        newStudentGrades.push(studentProfile);
      }

      await this.usersRepository.save(usersData);
      await this.studentProfileRepository.save(newStudentGrades);
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

  async registerSingleRecruiter(data: AddSingleRecruiterDto) {
    try {
      const recruiter = new RecruitersEntity();
      const user = new UsersEntity();

      recruiter.user = user;
      recruiter.fullName = data.firstName + ' ' + data.lastName;
      recruiter.company = data.company;
      recruiter.maxReservedStudents = data.maxReservedStudents;

      user.email = data.email;
      user.role = UserRole.HR;

      await this.usersRepository.save(user);
      await this.recruitersRepository.save(recruiter);

      await this.mailService.sendMail(
        data.email,
        'AKTYWUJ KONTO NA PLATFORMIE HEADHUNTERS by MegaK',
        `Aby dokończyć rejestrację na platformie HEADHUNTERS by MegaK, kliknij w ten link: ${config.APP_DOMAIN}/register/${user.id}/${user.registerToken}.`,
      );
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

  async activateUser(userId: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: {
          id: userId,
        },
      });
      user.isActive = true;
      await this.usersRepository.update(userId, user);
      return { message: 'User activated' };
    } catch (e) {
      if (e) {
        throw new BadRequestException(
          `Błąd podczas aktywacji konta: ${e.message}`,
        );
      }
    }
  }

  async setPassword(userId: string, password: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: {
          id: userId,
        },
      });
      user.pwd = await hashMethod(password);

      await this.usersRepository.update(userId, user);
      return { message: 'New password has been set' };
    } catch (e) {
      throw new BadRequestException(
        `Błąd podczas ustawiania hasła: ${e.message}`,
      );
    }
  }
}
