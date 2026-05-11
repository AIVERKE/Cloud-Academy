import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tarea } from './entities/tarea.entity';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
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

  async findByUser(userId: string): Promise<Tarea[]> {
    return await this.tareaRepository.find({
      where: { aula: { estudiantes: { id: userId } } },
      relations: ['aula'],
      order: { fecha_limite: 'ASC' },
    });
  }

  async update(id: string, updateAssignmentDto: UpdateAssignmentDto): Promise<Tarea> {
    const tarea = await this.tareaRepository.findOne({ where: { id } });
    if (!tarea) {
      throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
    }

    if (updateAssignmentDto.fecha_limite) {
      updateAssignmentDto.fecha_limite = new Date(updateAssignmentDto.fecha_limite).toISOString();
    }

    Object.assign(tarea, updateAssignmentDto);
    return await this.tareaRepository.save(tarea);
  }
}
