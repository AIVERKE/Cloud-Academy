import { Controller, Post, Put, Get, Body, Param, Headers, UnauthorizedException } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { GradeSubmissionDto } from './dto/grade-submission.dto';
import { AuditLog } from '../audit/decorators/audit-log.decorator';

@Controller('entregas')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @AuditLog('SUBMIT_ASSIGNMENT')
  @Post()
  async create(@Body() createSubmissionDto: CreateSubmissionDto) {
    return await this.submissionsService.create(createSubmissionDto);
  }

  @Put(':id/calificar')
  async grade(
    @Param('id') id: string,
    @Body() gradeSubmissionDto: GradeSubmissionDto,
    @Headers('user-id') userId: string,
  ) {
    if (!userId || userId === 'undefined') {
      throw new UnauthorizedException('User ID is required and must be valid');
    }
    return await this.submissionsService.grade(id, gradeSubmissionDto.calificacion, userId);
  }

  @Get('tarea/:tarea_id')
  async findByTarea(@Param('tarea_id') tareaId: string) {
    return await this.submissionsService.findByTarea(tareaId);
  }

  // Note: This endpoint matches the requirement GET /estudiantes/:id/mis-tareas
  // We can use a different controller if preferred, but for now we'll put it here
  // and map it to the requested path by using a global prefix or just handling it here.
  // However, @Controller('entregas') means all routes start with /entregas.
  // I will add a separate controller for students to match the requirement exactly.
}

@Controller('estudiantes')
export class StudentsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Get(':id/mis-tareas')
  async getMisTareas(@Param('id') id: string) {
    return await this.submissionsService.getStudentTasks(id);
  }
}
