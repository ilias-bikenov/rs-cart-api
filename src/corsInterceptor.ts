import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class CorsHeaderInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // When the request is HTTP
    if (context.getType() === 'http') {
      const http = context.switchToHttp();
      const response: Response = http.getResponse();
      response.setHeader('Access-Control-Allow-Origin', '*');
      response.setHeader('Access-Control-Allow-Methods', '*');
      response.setHeader('Access-Control-Allow-Headers', '*');
    }

    return next.handle();
  }
}
