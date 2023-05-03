import { DataSourceOptions } from 'typeorm/data-source/DataSourceOptions';
import { config } from './config';
import { DataSource } from 'typeorm';
import { StudentsEntity } from '../entities/students-entity';
import { ReservedStudentsEntity } from '../entities/reserved-students.entities';
import { RecruitersEntity } from '../entities/recruiters.entity';
import { UsersEntity } from '../entities/users.entity';

const entities = [
  UsersEntity,
  StudentsEntity,
  ReservedStudentsEntity,
  RecruitersEntity,
];

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: config.TYPEORM_HOST,
  port: parseInt(config.TYPEORM_PORT || '3306'),
  username: config.TYPEORM_USERNAME,
  password: config.TYPEORM_PASSWORD,
  database: config.TYPEORM_DATABASE,
  entities: entities,
  migrations: ['src/migrations'],
  synchronize: config.TYPEORM_SYNC,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
