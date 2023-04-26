import { DataSourceOptions } from 'typeorm/data-source/DataSourceOptions';
import { config } from './config';
import { DataSource } from 'typeorm';
import {UserEntity} from "../entities/User.entity";
import {StudentsEntity} from "../entities/Student.entity";
import {RecruiterEntity} from "../entities/Recruiters.entity";
import {ReservedStudentsEntities} from "../entities/Reserved.students.entities";

const entities = [
    UserEntity,
    StudentsEntity,
    RecruiterEntity,
    ReservedStudentsEntities,
];

export const dataSourceOptions: DataSourceOptions = {
    type: 'mysql',
    bigNumberStrings: false,
    logging: true,
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
