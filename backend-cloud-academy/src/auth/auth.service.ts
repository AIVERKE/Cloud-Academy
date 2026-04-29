import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { GoogleService } from '../google/google.service';
import { Role, RolNombre } from './entities/role.entity';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly googleService: GoogleService,
  ) {}

  async registerUserWithRole(google_id: string, nombre_completo: string, email: string, rolNombre: RolNombre) {
    let role = await this.roleRepository.findOne({ where: { nombre: rolNombre } });
    if (!role) {
      role = await this.roleRepository.save({ nombre: rolNombre });
    }

    const newUser = this.userRepository.create({
      google_id,
      nombre_completo,
      email,
      rol_id: role.id,
    });
    
    const savedUser = await this.userRepository.save(newUser);
    
    // Sincronización automática con Sheets
    await this.syncUserToSheets(savedUser, rolNombre);
    
    return savedUser;
  }

  /**
   * Módulo de sincronización automática con Google Sheets
   */
  async syncUserToSheets(user: User, roleName: string) {
    try {
      this.logger.log(`Sincronizando usuario ${user.email} con Google Sheets...`);
      await this.googleService.appendRowToSheet([
        user.id,
        user.nombre_completo,
        user.email,
        roleName,
        new Date().toISOString(),
      ]);
    } catch (error) {
      this.logger.error('Fallo en sincronización con Sheets', error);
    }
  }

  async registerStudent(userData: { google_id: string; nombre_completo: string; email: string }) {
    return this.registerUserWithRole(userData.google_id, userData.nombre_completo, userData.email, RolNombre.Estudiante);
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email }, relations: ['role'] });
  }
}
