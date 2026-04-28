import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';

export enum RolNombre {
  Root = 'Root',
  Docente = 'Docente',
  Estudiante = 'Estudiante',
}

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: RolNombre,
  })
  nombre: RolNombre;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
