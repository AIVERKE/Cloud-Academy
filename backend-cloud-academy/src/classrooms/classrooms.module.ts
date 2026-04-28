import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassroomsController } from './classrooms.controller';
import { ClassroomsService } from './classrooms.service';
import { Aula } from './entities/aula.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Aula])],
  controllers: [ClassroomsController],
  providers: [ClassroomsService],
  exports: [TypeOrmModule],
})
export class ClassroomsModule {}
