import { Controller, Post, Get, Patch, Body, Param, Headers } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
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

  @Patch(':aula_id/tareas/:id')
  async update(
    @Param('id') id: string,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
  ) {
    return await this.assignmentsService.update(id, updateAssignmentDto);
  }
}
