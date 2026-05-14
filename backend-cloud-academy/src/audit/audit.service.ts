import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogAuditoria } from './entities/log-auditoria.entity';
import { GoogleService } from '../google/google.service';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @InjectRepository(LogAuditoria)
    private readonly auditRepository: Repository<LogAuditoria>,
    private readonly googleService: GoogleService,
  ) {}

  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') {
      return body;
    }

    const sanitized = Array.isArray(body) ? [...body] : { ...body };
    const sensitiveKeys = ['password', 'token', 'access_token', 'refresh_token', 'google_id', 'secret'];

    for (const key in sanitized) {
      if (Object.prototype.hasOwnProperty.call(sanitized, key)) {
        const lowerKey = key.toLowerCase();
        const isSensitive = sensitiveKeys.some(sk => lowerKey.includes(sk));

        if (isSensitive) {
          sanitized[key] = '[REDACTED]';
        } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
          sanitized[key] = this.sanitizeBody(sanitized[key]);
        }
      }
    }

    return sanitized;
  }

  async createLog(usuario_id: string | null, accion: string, detalle: any): Promise<{ success: boolean, error?: string } | null> {
    try {
      const sanitizedDetalle = this.sanitizeBody(detalle);
      const log = this.auditRepository.create({
        usuario_id,
        accion,
        detalle: sanitizedDetalle,
      });

      const savedLog = await this.auditRepository.save(log);

      try {
        const result = await this.syncWithGoogleSheets(savedLog);
        return result === undefined ? null : { success: true };
      } catch (err) {
        this.logger.error(`Failed to sync log to Google Sheets: ${err.message}`);
        return { success: false, error: err.message };
      }
    } catch (error) {
      this.logger.error(`Failed to create audit log: ${error.message}`, error.stack);
      return null;
    }
  }

  private async syncWithGoogleSheets(log: LogAuditoria) {
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

    if (!sheetId || !credentialsPath) {
      // Si no hay configuración de Google Sheets, ignoramos el sync de forma silenciosa
      // o con un log de debug si fuera necesario.
      return;
    }

    const timestamp = new Date(log.fecha_hora).toLocaleString('es-BO');
    const values = [
      timestamp,
      log.usuario_id || 'SISTEMA',
      log.accion,
      JSON.stringify(log.detalle)
    ];

    try {
      await this.googleService.appendRowToSheet(sheetId, 'Hoja 1!A:D', values);
    } catch (err) {
      // Re-throw to be caught by the caller's catch block
      throw err;
    }
  }

  async getLogs(): Promise<LogAuditoria[]> {
    return this.auditRepository.find({
      order: {
        fecha_hora: 'DESC',
      },
    });
  }
}
