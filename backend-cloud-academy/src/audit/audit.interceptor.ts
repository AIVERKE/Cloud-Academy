import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { tap, mergeMap, map } from 'rxjs/operators';
import { AuditService } from './audit.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly auditService: AuditService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const method = request.method;

    // We only care about state-changing requests
    if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      return next.handle();
    }

    return next.handle().pipe(
      mergeMap(async (data) => {
        const syncResult = await this.logAction(context, request);
        
        // If there was a sync error, inject it into the response object
        if (syncResult && syncResult.success === false) {
          if (data && typeof data === 'object') {
            data._auditSyncError = syncResult.error || true;
          }
        }
        
        return data;
      }),
    );
  }

  private async logAction(context: ExecutionContext, request: any) {
    const userId = request.user?.id || null;

    // Check for custom @AuditLog decorator
    const customAction = this.reflector.get<string>('audit_log', context.getHandler());

    // Fallback to generic HTTP method and route if no decorator is present
    const action = customAction || `[${request.method}] ${request.route?.path || request.url}`;

    // The request body will be sanitized inside the AuditService
    const detalle = request.body;

    return await this.auditService.createLog(userId, action, detalle);
  }
}
