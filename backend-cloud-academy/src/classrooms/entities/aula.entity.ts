import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, ManyToMany } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('aulas')
export class Aula {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ unique: true })
  codigo_acceso: string;

  @Column()
  docente_id: string;

  @ManyToOne(() => User, (user) => user.aulas_docente)
  @JoinColumn({ name: 'docente_id' })
  docente: User;

  @Column({ default: true })
  estado: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_creacion: Date;

  @ManyToMany(() => User, (user) => user.aulas_inscritas)
  estudiantes: User[];
}
