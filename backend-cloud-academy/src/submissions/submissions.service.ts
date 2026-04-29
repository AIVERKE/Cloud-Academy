import { Injectable, NotFoundException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Entrega, EstadoEntrega } from './entities/entrega.entity';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { User } from '../auth/entities/user.entity';
import { Tarea } from '../assignments/entities/tarea.entity';
import { RolNombre } from '../auth/entities/role.entity';
import { Aula } from '../classrooms/entities/aula.entity';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Entrega)
    private readonly entregaRepository: Repository<Entrega>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tarea)
    private readonly tareaRepository: Repository<Tarea>,
    @InjectRepository(Aula)
    private readonly aulaRepository: Repository<Aula>,
  ) {}

  async create(createSubmissionDto: CreateSubmissionDto): Promise<Entrega> {
    const { tarea_id, estudiante_id } = createSubmissionDto;

    // Check if submission already exists
    const existing = await this.entregaRepository.findOne({
      where: { tarea_id, estudiante_id },
    });

    if (existing) {
      // In a real app we might allow updating, but for now we just return it or throw error
      return existing;
    }

    const submission = this.entregaRepository.create({
      tarea_id,
      estudiante_id,
      google_drive_file_id: '', // Temporary
      google_drive_url: '', // Temporary
      estado: EstadoEntrega.Pendiente,
    });

    return await this.entregaRepository.save(submission);
  }

  async grade(id: string, calificacion: number, docenteId: string): Promise<Entrega> {
    const submission = await this.entregaRepository.findOne({
      where: { id },
      relations: ['tarea', 'tarea.aula'],
    });

    if (!submission) {
      throw new NotFoundException(`Entrega con ID ${id} no encontrada`);
    }

    // Validate role and ownership
    const docente = await this.userRepository.findOne({
      where: { id: docenteId },
      relations: ['role'],
    });

    if (!docente || docente.role.nombre !== RolNombre.Docente) {
      throw new ForbiddenException('Solo los docentes pueden calificar entregas');
    }

    if (submission.tarea.aula.docente_id !== docenteId) {
      throw new ForbiddenException('No tienes permiso para calificar esta entrega');
    }

    submission.calificacion = calificacion;
    submission.estado = EstadoEntrega.Calificado;

    // TODO: Sincronizar con Google Sheets y notificar por Gmail (Ticket Pendiente de Credenciales)
    return await this.entregaRepository.save(submission);
  }

  async getTeacherDashboard(aulaId: string) {
    const aula = await this.aulaRepository.findOne({
      where: { id: aulaId },
      relations: ['estudiantes', 'estudiantes.role'],
    });

    if (!aula) {
      throw new NotFoundException(`Aula con ID ${aulaId} no encontrada`);
    }

    const tareas = await this.tareaRepository.find({
      where: { aula_id: aulaId },
      order: { fecha_creacion: 'DESC' },
    });

    // For each task, we want to see all students and their submission status
    const dashboard = await Promise.all(
      tareas.map(async (tarea) => {
        const entregas = await this.entregaRepository.find({
          where: { tarea_id: tarea.id },
        });

        const estudiantesStatus = aula.estudiantes.map((estudiante) => {
          const entrega = entregas.find((e) => e.estudiante_id === estudiante.id);
          return {
            id: estudiante.id,
            nombre_completo: estudiante.nombre_completo,
            email: estudiante.email,
            entrega: entrega
              ? {
                  id: entrega.id,
                  estado: entrega.estado,
                  calificacion: entrega.calificacion,
                  fecha_entrega: entrega.fecha_entrega,
                }
              : null,
          };
        });

        return {
          id: tarea.id,
          titulo: tarea.titulo,
          fecha_limite: tarea.fecha_limite,
          estudiantes: estudiantesStatus,
        };
      }),
    );

    return dashboard;
  }

  async getStudentTasks(estudianteId: string) {
    // Get all classrooms where student is enrolled
    const student = await this.userRepository.findOne({
      where: { id: estudianteId },
      relations: ['aulas_inscritas', 'aulas_inscritas.docente'],
    });

    if (!student) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    const results: any[] = [];

    for (const aula of student.aulas_inscritas) {
      const tareas = await this.tareaRepository.find({
        where: { aula_id: aula.id },
        order: { fecha_limite: 'ASC' },
      });

      for (const tarea of tareas) {
        const entrega = await this.entregaRepository.findOne({
          where: { tarea_id: tarea.id, estudiante_id: estudianteId },
        });

        results.push({
          aula: {
            id: aula.id,
            nombre: aula.nombre,
            docente: aula.docente.nombre_completo,
          },
          tarea: {
            id: tarea.id,
            titulo: tarea.titulo,
            descripcion: tarea.descripcion,
            fecha_limite: tarea.fecha_limite,
          },
          entrega: entrega
            ? {
                id: entrega.id,
                estado: entrega.estado,
                calificacion: entrega.calificacion,
                fecha_entrega: entrega.fecha_entrega,
              }
            : null,
        });
      }
    }

    return results;
  }
}
