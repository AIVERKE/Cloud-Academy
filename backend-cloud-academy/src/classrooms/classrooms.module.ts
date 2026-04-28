import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassroomsController } from './classrooms.controller';
import { ClassroomsService } from './classrooms.service';
import { Aula } from './entities/aula.entity';
import { User } from '../auth/entities/user.entity';
import { SubmissionsModule } from '../submissions/submissions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Aula, User]),
    SubmissionsModule,
  ],
  controllers: [ClassroomsController],
  providers: [ClassroomsService],
  exports: [ClassroomsService, TypeOrmModule],
})
export class ClassroomsModule {}
