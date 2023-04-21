import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersDto } from '../dtos/users.dto';
import { CsvUsersEntity } from '../entities/csv-users.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(CsvUsersEntity)
    private csvUsers: Repository<CsvUsersEntity>,
  ) {}

  async registerByCsv(data: UsersDto[]): Promise<CsvUsersEntity[]> {
    const newUsers: UsersDto[] = [];

    for (const row of data) {
      const user = new CsvUsersEntity();
      user.email = row.email;
      user.bonusProjectUrls = row.bonusProjectUrls;
      user.courseCompletion = row.courseCompletion;
      user.courseEngagement = row.courseEngagement;
      user.projectDegree = row.projectDegree;
      user.teamProjectDegree = row.teamProjectDegree;

      newUsers.push(user);
    }
    return await this.csvUsers.save(newUsers);
  }
}
