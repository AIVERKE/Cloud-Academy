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

  async onModuleInit() {
    // Si el entorno permite seeding (podemos chequear una variable de entorno)
    if (process.env.SEED_DATA === 'true') {
      await this.seedData();
    }
  }

  async seedData() {
    this.logger.log('Iniciando Seeding de datos de prueba...');
    
    const usersToSeed = [
      { google_id: '1001', nombre_completo: 'Diego (Admin)', email: 'diego@umsa.bo', rol: RolNombre.Root },
      { google_id: '1002', nombre_completo: 'Alejandro (Admin)', email: 'alejandro@umsa.bo', rol: RolNombre.Root },
      { google_id: '1003', nombre_completo: 'Jules (Estudiante)', email: 'jules@umsa.bo', rol: RolNombre.Estudiante },
    ];

    for (const u of usersToSeed) {
      const existing = await this.userRepository.findOne({ where: { email: u.email } });
      if (!existing) {
        await this.registerUserWithRole(u.google_id, u.nombre_completo, u.email, u.rol);
      }
    }
    this.logger.log('Seeding completado con éxito.');
  }

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
      await this.googleService.appendRowToSheet(
        process.env.GOOGLE_SHEET_ID || '',
        'Hoja 1!A:E',
        [
          user.id,
          user.nombre_completo,
          user.email,
          roleName,
          new Date().toISOString(),
        ],
      );
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

  async findAll() {
    return this.userRepository.find({ relations: ['role'] });
  }

  async findOne(id: string) {
    return this.userRepository.findOne({ where: { id }, relations: ['role'] });
  }

  async remove(id: string) {
    return this.userRepository.delete(id);
  }
}
