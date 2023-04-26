import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { dataSourceOptions } from './config/data-source';
import { config } from './config/config';

const rootModule = TypeOrmModule.forRoot(dataSourceOptions);

export const TypeormImports = [
  rootModule,

  TypeOrmModule.forFeature(dataSourceOptions.entities as EntityClassOrSchema[]),
];
