import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tarea } from './entities/tarea.entity';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { Aula } from '../classrooms/entities/aula.entity';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Tarea)
    private readonly tareaRepository: Repository<Tarea>,
    @InjectRepository(Aula)
    private readonly aulaRepository: Repository<Aula>,
  ) {}

  async create(aulaId: string, createAssignmentDto: CreateAssignmentDto, docenteId: string): Promise<Tarea> {
    const aula = await this.aulaRepository.findOne({ where: { id: aulaId } });
    
    if (!aula) {
      throw new NotFoundException(`Aula con ID ${aulaId} no encontrada`);
    }

    if (aula.docente_id !== docenteId) {
      throw new ForbiddenException('Solo el docente del aula puede crear tareas');
    }

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

  async findByUser(userId: string): Promise<Tarea[]> {
    return await this.tareaRepository.find({
      where: { aula: { estudiantes: { id: userId } } },
      relations: ['aula'],
      order: { fecha_limite: 'ASC' },
    });
  }
}
