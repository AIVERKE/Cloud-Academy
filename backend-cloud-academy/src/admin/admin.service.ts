import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { Resource } from '../resources/entities/resource.entity';
import { LogAuditoria } from '../audit/entities/log-auditoria.entity';
import { ResourcesService } from '../resources/resources.service';
import { GoogleService } from '../google/google.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>,
    @InjectRepository(LogAuditoria)
    private readonly auditRepository: Repository<LogAuditoria>,
    private readonly resourcesService: ResourcesService,
    private readonly googleService: GoogleService,
  ) {}

  async syncDrive() {
    return await this.resourcesService.syncResources();
  }

  async getLastSyncTime() {
    const lastSync = await this.auditRepository.findOne({
      where: { accion: 'SYNC_DRIVE' },
      order: { fecha_hora: 'DESC' },
    });
    return lastSync ? lastSync.fecha_hora : null;
  }

  async getSheetData(spreadsheetId: string) {
    if (!spreadsheetId) return [];
    try {
      // Intentamos leer la primera hoja
      const data = await this.googleService.getSheetData(spreadsheetId, 'Hoja 1!A1:Z100');
      return data || [];
    } catch (error) {
      console.error('Error fetching sheet data:', error);
      return [];
    }
  }

  async exportLogsToSheet(spreadsheetId: string) {
    if (!spreadsheetId) throw new Error('No Spreadsheet ID provided');

    const logs = await this.auditRepository.find({
      order: { fecha_hora: 'DESC' },
      take: 50,
      relations: ['usuario'],
    });

    const header = ['Fecha', 'Usuario', 'Acción', 'Detalle'];
    
    // Si la hoja está vacía, podríamos querer poner el header. 
    // Por simplicidad, vamos a append cada log como una nueva fila.
    
    for (const log of logs) {
      const row = [
        log.fecha_hora.toISOString(),
        log.usuario?.email || 'Sistema',
        log.accion,
        JSON.stringify(log.detalle),
      ];
      await this.googleService.appendRowToSheet(spreadsheetId, 'Hoja 1!A:D', row);
    }

    return { success: true, count: logs.length };
  }

  async getDashboardStats() {
    const [userCount, resourceCount, alertCount, recentLogs] = await Promise.all([
      this.userRepository.count(),
      this.resourceRepository.count(),
      this.auditRepository.count(),
      this.auditRepository.find({
        order: { fecha_hora: 'DESC' },
        take: 5,
        relations: ['usuario', 'usuario.role'],
      }),
    ]);

    const mappedActivities = recentLogs.map((log) => {
      const isError = log.accion.includes('ERROR') || log.accion.includes('FAIL');
      const userName = log.usuario?.nombre_completo || 'Sistema';
      const userRole = log.usuario?.role?.nombre ? ` (${log.usuario.role.nombre})` : '';
      
      return {
        title: this.prettifyAction(log.accion),
        description: log.detalle?.message || `Acción realizada por ${userName}${userRole}`,
        time: this.getRelativeTime(log.fecha_hora),
        icon: isError ? 'mdi-alert-circle' : 'mdi-check-circle',
        color: isError ? 'error' : 'success',
        tag: log.accion.split('_')[0] || 'SISTEMA',
      };
    });

    return {
      activeUsers: userCount,
      driveFiles: resourceCount,
      uptime: '99.98%',
      pendingAlerts: alertCount > 0 ? Math.ceil(alertCount / 12) : 0,
      activities: mappedActivities,
    };
  }

  private prettifyAction(action: string): string {
    return action
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }

  private getRelativeTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Ahora mismo';
    if (minutes < 60) return `Hace ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Hace ${hours} horas`;
    return `Hace ${Math.floor(hours / 24)} días`;
  }
}
