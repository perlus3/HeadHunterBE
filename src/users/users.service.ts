import {BadRequestException, HttpException, HttpStatus, Injectable,} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository, UpdateResult} from 'typeorm';
import {StudentsEntity} from '../entities/students-entity';
import {UserRole, UsersEntity} from '../entities/users.entity';
import {UpdateStudentProfileInfoDto} from '../dtos/update-student-profile-info.dto';
import {ChangeStudentStatusDto} from '../dtos/change-student-status.dto';
import {Command, Console} from "nestjs-console";
import {checkEmail} from "../utils/data-validators";
import {hashMethod} from "../utils/hash-password";

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
