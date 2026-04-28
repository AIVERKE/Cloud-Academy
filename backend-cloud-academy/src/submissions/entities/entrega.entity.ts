import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, UpdateDateColumn } from 'typeorm';
import { Tarea } from '../../assignments/entities/tarea.entity';
import { User } from '../../auth/entities/user.entity';

export enum EstadoEntrega {
  Pendiente = 'Pendiente',
  Calificado = 'Calificado',
  Atrasado = 'Atrasado',
}

export enum SyncStatus {
  Sincronizado = 'Sincronizado',
  Pendiente_Actualizacion = 'Pendiente_Actualizacion',
  Error_Sync = 'Error_Sync',
}

@Entity('entregas')
export class Entrega {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tarea_id: string;

  @ManyToOne(() => Tarea, (tarea) => tarea.entregas)
  @JoinColumn({ name: 'tarea_id' })
  tarea: Tarea;

  @Column()
  estudiante_id: string;

  @ManyToOne(() => User, (user) => user.entregas)
  @JoinColumn({ name: 'estudiante_id' })
  estudiante: User;

  @Column()
  google_drive_file_id: string;

  @Column()
  google_drive_url: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  calificacion: number;

  @Column({
    type: 'enum',
    enum: EstadoEntrega,
    default: EstadoEntrega.Pendiente,
  })
  estado: EstadoEntrega;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_entrega: Date;

  @Column({ nullable: true })
  sheet_row_index: number;

  @Column({
    type: 'enum',
    enum: SyncStatus,
    default: SyncStatus.Sincronizado,
  })
  sync_status: SyncStatus;

  @UpdateDateColumn({ type: 'timestamp' })
  ultima_sincronizacion: Date;
}
