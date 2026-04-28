import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolNombre } from '../auth/entities/role.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auditoria')
@Controller('auditoria')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(RolNombre.Root)
  @ApiOperation({ summary: 'Obtener el historial de auditoría' })
  @ApiResponse({
    status: 200,
    description: 'Lista de logs de auditoría obtenida exitosamente.',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado. Solo permitido para el rol Root.',
  })
  async getLogs() {
    return this.auditService.getLogs();
  }
}
