import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

/**
 * 管理员守卫：验证 token 且 role 必须为 admin
 */
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('未提供认证令牌');
    }

    let payload;
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret:
          process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      });
    } catch {
      throw new UnauthorizedException('无效的认证令牌');
    }

    if (payload.role !== 'admin') {
      throw new ForbiddenException('需要管理员权限');
    }

    request.user = { ...payload, id: payload.sub };
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
