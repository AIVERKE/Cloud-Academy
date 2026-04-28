import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Aula } from '../../classrooms/entities/aula.entity';
import { Entrega } from '../../submissions/entities/entrega.entity';

@Entity('tareas')
export class Tarea {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  aula_id: string;

  @ManyToOne(() => Aula)
  @JoinColumn({ name: 'aula_id' })
  aula: Aula;

  @Column()
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'timestamp' })
  fecha_limite: Date;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_creacion: Date;

  @OneToMany(() => Entrega, (entrega) => entrega.tarea)
  entregas: Entrega[];
}
