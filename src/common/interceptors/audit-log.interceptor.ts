import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AUDIT_LOG_KEY } from '../decorators/audit-log.decorator';

/**
 * Interceptor de Auditoría (Audit Log Interceptor).
 * Aspecto encargado de registrar cambios estructurales en el sistema
 * mediante la interceptación de mutaciones marcadas con el decorador `@AuditLog()`.
 */
@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger('AuditAspectLogger');

  constructor(private readonly reflector: Reflector) {}

  /**
   * Intercepta la ejecución del resolver, verifica si cuenta con el metadato de auditoría
   * y genera un log estructurado con el resultado de la operación.
   * @param context Contexto de ejecución actual.
   * @param next Siguiente manejador.
   * @returns Flujo observable del resultado.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Intentar leer la acción configurada para este resolver
    const action = this.reflector.get<string>(AUDIT_LOG_KEY, context.getHandler());

    // Si no está decorado con @AuditLog, simplemente continuamos sin auditar
    if (!action) {
      return next.handle();
    }

    const gqlContext = GqlExecutionContext.create(context);
    const args = gqlContext.getArgs();
    const info = gqlContext.getInfo();
    const fieldName = info.fieldName;

    return next.handle().pipe(
      tap({
        next: (result) => {
          // Extraemos información de identificación si el resultado contiene un ID
          const targetId = result && typeof result === 'object' ? result.id : (args.id || 'N/A');
          
          this.logger.log(
            `[AUDITORÍA] Acción: ${action} - Resolver: ${fieldName} - ID Afectado: ${targetId} - Payload: ${JSON.stringify(
              args,
            )} - Estado: COMPLETADO`,
          );
        },
        error: (err) => {
          this.logger.warn(
            `[AUDITORÍA] Acción: ${action} - Resolver: ${fieldName} - Payload: ${JSON.stringify(
              args,
            )} - Estado: FALLIDO. Razón: ${err.message}`,
          );
        },
      }),
    );
  }
}
