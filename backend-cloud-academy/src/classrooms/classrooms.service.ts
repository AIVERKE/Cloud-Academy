import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In } from 'typeorm';
import { Aula } from './entities/aula.entity';
import { User } from '../auth/entities/user.entity';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { JoinClassroomDto } from './dto/join-classroom.dto';

@Injectable()
export class ClassroomsService {
  constructor(
    @InjectRepository(Aula)
    private readonly aulaRepository: Repository<Aula>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createClassroomDto: CreateClassroomDto, docenteId: string): Promise<Aula> {
    const { nombre, codigo_acceso, descripcion } = createClassroomDto;

    // Verificar si ya existe un aula con ese código
    const existingAula = await this.aulaRepository.findOne({ where: { codigo_acceso } });
    if (existingAula) {
      throw new ConflictException(`El código de acceso "${codigo_acceso}" ya está en uso.`);
    }

    try {
      const newAula = this.aulaRepository.create({
        nombre,
        codigo_acceso,
        descripcion,
        docente_id: docenteId,
      });

      return await this.aulaRepository.save(newAula);
    } catch (error) {
      if (error.code === '23503') { // Foreign key violation
        throw new NotFoundException('El docente especificado no existe en el sistema.');
      }
      throw error;
    }
  }

  async findAll(userId: string): Promise<Aula[]> {
    // This is a simplified version. In a real app, you'd check the user's role.
    // For now, we return both classrooms taught by the user and those they are enrolled in.
    return await this.aulaRepository.find({
      where: [
        { docente_id: userId },
        { estudiantes: { id: userId } }
      ],
      relations: ['docente'],
    });
  }

  async join(joinClassroomDto: JoinClassroomDto, estudianteId: string): Promise<Aula> {
    const { codigo_acceso } = joinClassroomDto;

    const aula = await this.aulaRepository.findOne({
      where: { codigo_acceso },
      relations: ['estudiantes'],
    });

    if (!aula) {
      throw new NotFoundException(`Aula con código ${codigo_acceso} no encontrada`);
    }

    const isEnrolled = aula.estudiantes.some((e) => e.id === estudianteId);
    if (isEnrolled) {
      throw new ConflictException('Ya estás inscrito en esta aula');
    }

    const estudiante = await this.userRepository.findOneBy({ id: estudianteId });
    if (!estudiante) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    aula.estudiantes.push(estudiante);
    return await this.aulaRepository.save(aula);
  }

  async getStudents(aulaId: string): Promise<User[]> {
    const aula = await this.aulaRepository.findOne({
      where: { id: aulaId },
      relations: ['estudiantes'],
    });

    if (!aula) {
      throw new NotFoundException(`Aula con ID ${aulaId} no encontrada`);
    }

    return aula.estudiantes;
  }

  async getAvailable(userId: string): Promise<Aula[]> {
    // Para simplificar, devolvemos todas las aulas donde el usuario NO es el docente
    // y luego filtramos aquellas donde no está inscrito
    const allAulas = await this.aulaRepository.find({
      where: { docente_id: Not(userId) },
      relations: ['estudiantes', 'docente'],
    });

    return allAulas.filter(aula => !aula.estudiantes.some(e => e.id === userId));
  }

  private generateAccessCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
}
