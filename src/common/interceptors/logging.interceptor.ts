import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Interceptor de registro (Logging Interceptor).
 * Representa un Aspecto en AOP encargado de interceptar todas las resoluciones
 * de GraphQL para realizar perfiles de rendimiento y registrar detalles de ejecución.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('GraphQLAspectLogger');

  /**
   * Intercepta la llamada a un resolver de GraphQL, mide el tiempo de respuesta
   * y registra los detalles de la consulta o mutación.
   * @param context Contexto de ejecución actual.
   * @param next Siguiente manejador en la tubería de ejecución.
   * @returns Flujo observable del resultado.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();

    // Verificamos si es un contexto de GraphQL
    if (context.getType().toString() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context);
      const info = gqlContext.getInfo();
      const args = gqlContext.getArgs();
      
      const parentType = info.parentType?.name || 'GraphQL';
      const fieldName = info.fieldName;
      const operationType = info.operation?.operation || 'query';

      this.logger.log(
        `[INICIO] Operación: ${operationType} - Resolver: ${parentType}.${fieldName} - Argumentos: ${JSON.stringify(
          args,
        )}`,
      );

      return next.handle().pipe(
        tap({
          next: (val) => {
            const duration = Date.now() - startTime;
            this.logger.log(
              `[EXITO] Operación: ${operationType} - Resolver: ${parentType}.${fieldName} finalizado en ${duration}ms`,
            );
          },
          error: (err) => {
            const duration = Date.now() - startTime;
            this.logger.error(
              `[ERROR] Operación: ${operationType} - Resolver: ${parentType}.${fieldName} falló en ${duration}ms. Mensaje: ${err.message}`,
              err.stack,
            );
          },
        }),
      );
    }

    // Comportamiento por defecto para peticiones HTTP normales
    const request = context.switchToHttp().getRequest();
    if (request) {
      const method = request.method;
      const url = request.url;
      this.logger.log(`[INICIO HTTP] ${method} ${url}`);
      return next.handle().pipe(
        tap({
          next: () => {
            const duration = Date.now() - startTime;
            this.logger.log(`[EXITO HTTP] ${method} ${url} - ${duration}ms`);
          },
          error: (err) => {
            const duration = Date.now() - startTime;
            this.logger.error(
              `[ERROR HTTP] ${method} ${url} - falló en ${duration}ms. Mensaje: ${err.message}`,
            );
          },
        }),
      );
    }

    return next.handle();
  }
}
