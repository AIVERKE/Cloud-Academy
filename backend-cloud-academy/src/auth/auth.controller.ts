import { Controller, Post, Body, Get, Delete, Param, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuditLog } from '../audit/decorators/audit-log.decorator';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @AuditLog('LOGIN')
  @Post('login')
  async login(@Body() credentials: { email: string; password?: string }) {
    const user = credentials.password 
      ? await this.authService.validateUser(credentials.email, credentials.password)
      : await this.authService.findByEmail(credentials.email);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return { 
      success: true, 
      message: 'Login exitoso',
      user: {
        id: user.id,
        email: user.email,
        name: user.nombre_completo,
        role: user.role?.nombre || 'Estudiante'
      }
    };
  }
  
  @AuditLog('REGISTER')
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
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
