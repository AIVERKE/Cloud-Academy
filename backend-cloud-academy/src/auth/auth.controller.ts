import { Controller, Post, Body, Get, Delete, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuditLog } from '../audit/decorators/audit-log.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @AuditLog('LOGIN')
  @Post('login')
  async login(@Body() credentials: { email: string }) {
    return { success: true, message: 'Login tracked' };
  }

  @Post('register-test')
  async registerTest(@Body() userData: { google_id: string; nombre_completo: string; email: string }) {
    return this.authService.registerStudent(userData);
  }

  @Get('usuarios')
  async findAll() {
    return this.authService.findAll();
  }

  @Delete('usuarios/:id')
  async remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }
}
