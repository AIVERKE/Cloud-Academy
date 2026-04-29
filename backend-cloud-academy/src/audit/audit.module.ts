import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';
import { LogAuditoria } from './entities/log-auditoria.entity';
import { GoogleModule } from '../google/google.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LogAuditoria]),
    GoogleModule,
  ],
  controllers: [AuditController],
  providers: [AuditService],
  exports: [TypeOrmModule, AuditService],
})
export class AuditModule {}
