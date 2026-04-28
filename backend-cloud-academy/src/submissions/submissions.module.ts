import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubmissionsController } from './submissions.controller';
import { SubmissionsService } from './submissions.service';
import { Entrega } from './entities/entrega.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Entrega])],
  controllers: [SubmissionsController],
  providers: [SubmissionsService],
  exports: [TypeOrmModule],
})
export class SubmissionsModule {}
