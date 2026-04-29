import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  getStats() {
    return this.adminService.getDashboardStats();
  }

  @Post('sync-drive')
  async syncDrive() {
    return await this.adminService.syncDrive();
  }
}
