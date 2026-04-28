import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
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
      tap(() => {
        // Run audit logging after the request was successfully handled
        this.logAction(context, request);
      }),
    );
  }

  private logAction(context: ExecutionContext, request: any) {
    const userId = request.user?.id || '00000000-0000-0000-0000-000000000000'; // Mock UUID fallback

    // Check for custom @AuditLog decorator
    const customAction = this.reflector.get<string>('audit_log', context.getHandler());

    // Fallback to generic HTTP method and route if no decorator is present
    const action = customAction || `[${request.method}] ${request.route?.path || request.url}`;

    // The request body will be sanitized inside the AuditService
    const detalle = request.body;

    // Fire and forget - the service has internal error handling
    this.auditService.createLog(userId, action, detalle);
  }
}
