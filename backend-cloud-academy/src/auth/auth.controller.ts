import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register-test')
  async registerTest(@Body() userData: { google_id: string; nombre_completo: string; email: string }) {
    return this.authService.registerStudent(userData);
  }
}
