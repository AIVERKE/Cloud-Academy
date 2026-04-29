import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resource } from './entities/resource.entity';
import { GoogleService } from '../google/google.service';

@Injectable()
export class ResourcesService {
  private readonly logger = new Logger(ResourcesService.name);

  constructor(
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>,
    private readonly googleService: GoogleService,
  ) {}

  /**
   * Obtiene todos los recursos guardados en la base de datos local.
   */
  async findAll() {
    return this.resourceRepository.find({
      order: { name: 'ASC' },
    });
  }

  /**
   * Sincroniza los metadatos de Drive con PostgreSQL.
   */
  async syncResources() {
    this.logger.log('Iniciando sincronización de recursos (Drive -> DB)...');
    
    try {
      // 1. Obtener archivos desde Drive
      const driveFiles = await this.googleService.listFiles();
      this.logger.log(`Se encontraron ${driveFiles.length} archivos en Drive.`);

      const syncResults = {
        creados: 0,
        actualizados: 0,
        errores: 0,
      };

      // 2. Recorrer y guardar/actualizar
      for (const file of driveFiles) {
        try {
          // Validación crítica: si no hay ID, no podemos sincronizar
          if (!file.id) {
            this.logger.warn(`Saltando archivo sin ID: ${file.name}`);
            continue;
          }

          // Buscamos si ya existe por el googleDriveId
          let resource = await this.resourceRepository.findOne({
            where: { googleDriveId: file.id },
          });

          if (resource) {
            // Actualizar (usamos ?? para asegurar que no mandamos null/undefined)
            resource.name = file.name ?? 'Sin nombre';
            resource.webViewLink = file.webViewLink ?? '';
            resource.mimeType = file.mimeType ?? 'application/octet-stream';
            syncResults.actualizados++;
          } else {
            // Crear nuevo
            resource = this.resourceRepository.create({
              googleDriveId: file.id,
              name: file.name ?? 'Sin nombre',
              webViewLink: file.webViewLink ?? '',
              mimeType: file.mimeType ?? 'application/octet-stream',
            });
            syncResults.creados++;
          }

          await this.resourceRepository.save(resource);
        } catch (err) {
          this.logger.error(`Error sincronizando archivo ${file.name}`, err);
          syncResults.errores++;
        }
      }

      this.logger.log(`Sincronización completada: ${syncResults.creados} creados, ${syncResults.actualizados} actualizados.`);
      return syncResults;
    } catch (error) {
      this.logger.error('Fallo crítico en la sincronización', error);
      throw error;
    }
  }
}
