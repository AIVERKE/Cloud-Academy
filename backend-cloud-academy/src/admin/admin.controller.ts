import { Controller, Get, Post, Query, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuditLog } from '../audit/decorators/audit-log.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolNombre } from '../auth/entities/role.entity';

@Controller('admin')
@UseGuards(AuthGuard, RolesGuard)
@Roles(RolNombre.Root)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  getStats() {
    return this.adminService.getDashboardStats();
  }

  @AuditLog('SYNC_DRIVE')
  @Post('sync-drive')
  async syncDrive() {
    return await this.adminService.syncDrive();
  }

  @Get('last-sync')
  async getLastSync() {
    const timestamp = await this.adminService.getLastSyncTime();
    return { timestamp };
  }

  @Get('sheet-data')
  async getSheetData(@Query('spreadsheetId') spreadsheetId: string) {
    return this.adminService.getSheetData(spreadsheetId);
  }

  @Post('export-logs')
  async exportLogs(@Body('spreadsheetId') spreadsheetId: string) {
    return this.adminService.exportLogsToSheet(spreadsheetId);
  }
}
