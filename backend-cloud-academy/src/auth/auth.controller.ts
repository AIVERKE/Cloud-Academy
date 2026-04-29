import { Controller, Post, Body, Get, Delete, Param, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuditLog } from '../audit/decorators/audit-log.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @AuditLog('LOGIN')
  @Post('login')
  async login(@Body() credentials: { email: string }) {
    const user = await this.authService.findByEmail(credentials.email);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    return { 
      success: true, 
      message: 'Login tracked',
      user: {
        id: user.id,
        email: user.email,
        name: user.nombre_completo,
        role: user.role?.nombre || 'Estudiante'
      }
    };
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
