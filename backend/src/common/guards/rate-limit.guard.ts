import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RateLimitGuard implements CanActivate {
  private requests: Map<string, { count: number; resetAt: number }> = new Map();
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(private configService: ConfigService) {
    this.windowMs = parseInt(configService.get('RATE_LIMIT_WINDOW_MS') || '900000', 10); // 15 minutes default
    this.maxRequests = parseInt(configService.get('RATE_LIMIT_MAX_REQUESTS') || '100', 10);
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const ip = this.getIpAddress(request);
    const key = `${request.method}:${request.url}:${ip}`;

    const now = Date.now();
    const record = this.requests.get(key);

    if (!record || now > record.resetAt) {
      // Create new record or reset expired one
      this.requests.set(key, {
        count: 1,
        resetAt: now + this.windowMs,
      });
      return true;
    }

    if (record.count >= this.maxRequests) {
      throw new HttpException(
        'Too many requests, please try again later',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    record.count++;
    return true;
  }

  private getIpAddress(request: any): string {
    return (
      request.ip ||
      request.connection?.remoteAddress ||
      request.socket?.remoteAddress ||
      request.headers['x-forwarded-for']?.split(',')[0] ||
      'unknown'
    );
  }
}

