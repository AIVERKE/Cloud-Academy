import { Controller, Post, Get, Body, Param, Headers, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ClassroomsService } from './classrooms.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { JoinClassroomDto } from './dto/join-classroom.dto';
import { SubmissionsService } from '../submissions/submissions.service';
import { AuditLog } from '../audit/decorators/audit-log.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolNombre } from '../auth/entities/role.entity';

@Controller('aulas')
@UseGuards(AuthGuard, RolesGuard)
export class ClassroomsController {
  constructor(
    private readonly classroomsService: ClassroomsService,
    private readonly submissionsService: SubmissionsService,
  ) {}

  @AuditLog('CREATE_AULA')
  @Post()
  async create(
    @Body() createClassroomDto: CreateClassroomDto,
    @Headers('user-id') userId: string,
  ) {
    if (!userId || userId === 'undefined') {
      throw new UnauthorizedException('User ID is required and must be valid');
    }
    return await this.classroomsService.create(createClassroomDto, userId);
  }

  @Get()
  async findAll(@Headers('user-id') userId: string) {
    if (!userId || userId === 'undefined') {
      throw new UnauthorizedException('User ID is required and must be valid');
    }
    return await this.classroomsService.findAll(userId);
  }

  @Get('disponibles')
  async getAvailableClassrooms(@Headers('user-id') userId: string) {
    if (!userId || userId === 'undefined') {
      throw new UnauthorizedException('User ID is required and must be valid');
    }
    return await this.classroomsService.getAvailable(userId);
  }

  @Post('unirse')
  async join(
    @Body() joinClassroomDto: JoinClassroomDto,
    @Headers('user-id') userId: string,
  ) {
    if (!userId || userId === 'undefined') {
      throw new UnauthorizedException('User ID is required and must be valid');
    }
    return await this.classroomsService.join(joinClassroomDto, userId);
  }

  @Get('docente/stats')
  async getDocenteStats(@Headers('user-id') userId: string) {
    if (!userId || userId === 'undefined') {
      throw new UnauthorizedException('User ID is required and must be valid');
    }
    return await this.submissionsService.getGlobalTeacherStats(userId);
  }

  @Get(':aula_id/dashboard-docente')
  async getDashboard(
    @Param('aula_id') aulaId: string,
    @Headers('user-id') userId: string,
  ) {
    if (!userId || userId === 'undefined') {
      throw new UnauthorizedException('User ID is required and must be valid');
    }
    return await this.submissionsService.getTeacherDashboard(aulaId);
  }

  @Get(':id/estudiantes')
  async getStudents(@Param('id') id: string) {
    return await this.classroomsService.getStudents(id);
  }
}
