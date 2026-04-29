import { Controller, Post, Get, Body, Param, Headers, UseGuards } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolNombre } from '../auth/entities/role.entity';

@Controller('aulas')
@UseGuards(AuthGuard, RolesGuard)
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get(':aula_id/tareas')
  async findAll(@Param('aula_id') aulaId: string) {
    return await this.assignmentsService.findByAula(aulaId);
  }

  @Get('tareas/estudiante')
  async findForStudent(@Headers('user-id') userId: string) {
    return await this.assignmentsService.findByUser(userId);
  }

  @Roles(RolNombre.Docente)
  @Post(':aula_id/tareas')
  async create(
    @Param('aula_id') aulaId: string,
    @Body() createAssignmentDto: CreateAssignmentDto,
    @Headers('user-id') userId: string,
  ) {
    return await this.assignmentsService.create(aulaId, createAssignmentDto, userId);
  }
}
