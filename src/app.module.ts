import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeormImports } from "./typeorm";

@Module({
  imports: [...TypeormImports],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
