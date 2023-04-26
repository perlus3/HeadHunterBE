import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {DatabaseModule} from "./database/database.module";
import {UsersEntity} from "./entities/User.entity";

@Module({
  imports: [DatabaseModule, UsersEntity],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
