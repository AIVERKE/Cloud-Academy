import { SetMetadata } from '@nestjs/common';

export const AuditLog = (action: string) => SetMetadata('audit_log', action);
