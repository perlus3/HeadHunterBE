import { DataSourceOptions } from 'typeorm/data-source/DataSourceOptions';
import { config } from './config';
import { DataSource } from 'typeorm';
import { UsersEntity } from '../entities/users.entity';
import { StudentProfileEntity } from '../entities/student-profile.entity';
import { TestEntity } from '../entities/test.entity';

const entities = [UsersEntity, StudentProfileEntity, TestEntity];

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
