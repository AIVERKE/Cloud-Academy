import { Controller, Get, Post, Logger } from '@nestjs/common';
import { ResourcesService } from './resources.service';

@Controller('recursos')
export class ResourcesController {
  private readonly logger = new Logger(ResourcesController.name);

  constructor(private readonly resourcesService: ResourcesService) {}

  /**
   * Obtiene la lista de recursos desde la BASE DE DATOS LOCAL.
   * Esto es mucho más rápido que llamar a Drive siempre.
   */
  @Get()
  async getResources() {
    this.logger.log('Obteniendo lista de recursos desde la base de datos local...');
    return this.resourcesService.findAll();
  }

  /**
   * Endpoint de sincronización manual.
   * Trae los metadatos desde Drive y los persiste en PostgreSQL.
   */
  @Post('sync')
  async syncResources() {
    this.logger.log('Solicitud de sincronización manual recibida.');
    const results = await this.resourcesService.syncResources();
    return {
      message: 'Sincronización finalizada con éxito',
      ...results,
    };
  }
}
