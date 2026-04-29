import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Role } from './entities/role.entity';
import { User } from './entities/user.entity';
import { GoogleModule } from '../google/google.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, User]),
    GoogleModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [TypeOrmModule, AuthService],
})
export class AuthModule {}
