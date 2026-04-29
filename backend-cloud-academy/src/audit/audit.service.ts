import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogAuditoria } from './entities/log-auditoria.entity';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @InjectRepository(LogAuditoria)
    private readonly auditRepository: Repository<LogAuditoria>,
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

  async createLog(usuario_id: string | null, accion: string, detalle: any): Promise<void> {
    try {
      const sanitizedDetalle = this.sanitizeBody(detalle);

      const log = this.auditRepository.create({
        usuario_id,
        accion,
        detalle: sanitizedDetalle,
      });

      await this.auditRepository.save(log);
    } catch (error) {
      // Silently handle error, but log it to the server console
      this.logger.error(`Failed to create audit log: ${error.message}`, error.stack);
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
