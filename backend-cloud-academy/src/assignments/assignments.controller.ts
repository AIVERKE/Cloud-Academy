import { Controller, Post, Body, Param } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';

@Controller('aulas')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post(':aula_id/tareas')
  async create(
    @Param('aula_id') aulaId: string,
    @Body() createAssignmentDto: CreateAssignmentDto,
  ) {
    return await this.assignmentsService.create(aulaId, createAssignmentDto);
  }
}
