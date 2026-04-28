import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubmissionsController, StudentsController } from './submissions.controller';
import { SubmissionsService } from './submissions.service';
import { Entrega } from './entities/entrega.entity';
import { User } from '../auth/entities/user.entity';
import { Tarea } from '../assignments/entities/tarea.entity';
import { Aula } from '../classrooms/entities/aula.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Entrega, User, Tarea, Aula])],
  controllers: [SubmissionsController, StudentsController],
  providers: [SubmissionsService],
  exports: [SubmissionsService, TypeOrmModule],
})
export class SubmissionsModule {}
