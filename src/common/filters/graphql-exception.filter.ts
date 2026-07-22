import { Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';

/**
 * Filtro de Excepciones de GraphQL (GraphQL Exception Filter).
 * Aspecto encargado de interceptar todos los errores no controlados
 * que ocurran durante la ejecución de los resolvers de GraphQL.
 */
@Catch()
export class GraphQLExceptionFilter implements GqlExceptionFilter {
  private readonly logger = new Logger('ExceptionAspectLogger');

  /**
   * Captura la excepción, realiza un registro estructurado del error
   * (incluyendo el resolver y los argumentos que lo originaron)
   * y delega el formateo final a Apollo Server.
   * @param exception Excepción capturada.
   * @param host Argumentos del host de ejecución.
   * @returns La excepción original para que Apollo la propague en el JSON.
   */
  catch(exception: any, host: ArgumentsHost): any {
    const gqlHost = GqlArgumentsHost.create(host);
    const info = gqlHost.getInfo();
    const args = gqlHost.getArgs();

    // Determinar la procedencia del error en el esquema
    const path = info
      ? `${info.parentType?.name || 'GraphQL'}.${info.fieldName}`
      : 'Contexto no GraphQL';

    const errorMessage = exception.message || 'Error desconocido';
    const status = exception.status || 500;

    // Loguear detalles del error
    this.logger.error(
      `[EXCEPCIÓN] Ruta: ${path} - Argumentos: ${JSON.stringify(
        args,
      )} - Mensaje: "${errorMessage}" - Estado HTTP/Código: ${status}`,
      exception.stack,
    );

    // En GraphQL de NestJS, si retornamos la excepción, Apollo la atrapa
    // y la agrega al arreglo 'errors' del response de manera estándar.
    return exception;
  }
}
