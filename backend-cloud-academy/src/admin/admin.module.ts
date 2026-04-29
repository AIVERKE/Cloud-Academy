import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../auth/entities/user.entity';
import { Resource } from '../resources/entities/resource.entity';
import { LogAuditoria } from '../audit/entities/log-auditoria.entity';
import { ResourcesModule } from '../resources/resources.module';
import { GoogleModule } from '../google/google.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Resource, LogAuditoria]),
    ResourcesModule,
    GoogleModule,
    AuthModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
