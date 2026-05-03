import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable, BeforeInsert, BeforeUpdate } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from './role.entity';
import { Aula } from '../../classrooms/entities/aula.entity';
import { Entrega } from '../../submissions/entities/entrega.entity';
import { LogAuditoria } from '../../audit/entities/log-auditoria.entity';

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  google_id?: string;

  @Column()
  nombre_completo: string;

  @Column({ unique: true })
  email: string;

  @Column()
  rol_id: string;

  @Column({ nullable: true })
  password?: string;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'rol_id' })
  role: Role;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_creacion: Date;

  @OneToMany(() => Aula, (aula) => aula.docente)
  aulas_docente: Aula[];

  @ManyToMany(() => Aula, (aula) => aula.estudiantes)
  @JoinTable({
    name: 'inscripciones',
    joinColumn: { name: 'estudiante_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'aula_id', referencedColumnName: 'id' },
  })
  aulas_inscritas: Aula[];

  @OneToMany(() => Entrega, (entrega) => entrega.estudiante)
  entregas: Entrega[];

  @OneToMany(() => LogAuditoria, (log) => log.usuario)
  logs: LogAuditoria[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
