import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('logs_auditoria')
export class LogAuditoria {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  usuario_id: string | null;

  @ManyToOne(() => User, (user) => user.logs, { nullable: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: User | null;

  @Column()
  accion: string;

  @Column({ type: 'jsonb', nullable: true })
  detalle: any;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_hora: Date;
}
