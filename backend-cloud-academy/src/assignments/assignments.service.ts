import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tarea } from './entities/tarea.entity';
import { CreateAssignmentDto } from './dto/create-assignment.dto';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Tarea)
    private readonly tareaRepository: Repository<Tarea>,
  ) {}

  async create(aulaId: string, createAssignmentDto: CreateAssignmentDto): Promise<Tarea> {
    const newTarea = this.tareaRepository.create({
      ...createAssignmentDto,
      aula_id: aulaId,
      fecha_limite: new Date(createAssignmentDto.fecha_limite),
    });

    return await this.tareaRepository.save(newTarea);
  }

  async findByAula(aulaId: string): Promise<Tarea[]> {
    return await this.tareaRepository.find({
      where: { aula_id: aulaId },
      order: { fecha_creacion: 'DESC' },
    });
  }
}
