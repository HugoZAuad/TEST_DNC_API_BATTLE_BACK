import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;

    let actionDescription = '';

    switch (method) {
      case 'GET':
        actionDescription = `Requisição para obter recurso em ${url}`;
        break;
      case 'POST':
        actionDescription = `Requisição para criar recurso em ${url}`;
        break;
      case 'PATCH':
        actionDescription = `Requisição para atualizar recurso em ${url}`;
        break;
      case 'PUT':
        actionDescription = `Requisição para substituir recurso em ${url}`;
        break;
      case 'DELETE':
        actionDescription = `Requisição para deletar recurso em ${url}`;
        break;
      default:
        actionDescription = `Requisição ${method} para ${url}`;
    }

    this.logger.log(actionDescription);

    return next.handle().pipe(
      tap(() => {

      }),
    );
  }
}
