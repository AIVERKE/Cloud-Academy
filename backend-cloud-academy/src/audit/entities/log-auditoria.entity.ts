import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('logs_auditoria')
export class LogAuditoria {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  usuario_id: string;

  @ManyToOne(() => User, (user) => user.logs)
  @JoinColumn({ name: 'usuario_id' })
  usuario: User;

  @Column()
  accion: string;

  @Column({ type: 'jsonb', nullable: true })
  detalle: any;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_hora: Date;
}
