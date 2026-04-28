import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';
import { LogAuditoria } from './entities/log-auditoria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LogAuditoria])],
  controllers: [AuditController],
  providers: [AuditService],
  exports: [TypeOrmModule],
})
export class AuditModule {}
