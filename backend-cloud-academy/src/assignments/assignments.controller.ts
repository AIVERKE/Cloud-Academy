import { Controller, Post, Get, Body, Param, Headers } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';

@Controller('aulas')
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

  @Post(':aula_id/tareas')
  async create(
    @Param('aula_id') aulaId: string,
    @Body() createAssignmentDto: CreateAssignmentDto,
  ) {
    return await this.assignmentsService.create(aulaId, createAssignmentDto);
  }
}
