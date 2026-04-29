import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.headers['user-id'];

    if (!userId || userId === 'undefined') {
      throw new UnauthorizedException('User ID header is missing');
    }

    const user = await this.authService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Attach user to request so RolesGuard can use it
    request.user = user;
    return true;
  }
}
