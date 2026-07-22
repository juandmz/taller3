import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AuditLogInterceptor } from './common/interceptors/audit-log.interceptor';
import { GraphQLExceptionFilter } from './common/filters/graphql-exception.filter';

/**
 * Función principal para arrancar y configurar el servidor NestJS.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar validaciones globales en los DTOs de entrada
  // transform: true convierte automáticamente los payloads a las clases de DTO correspondientes.
  // whitelist: true descarta atributos que no estén definidos en los DTOs.
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  // Registro global de Aspectos AOP (Interceptors y Filters)
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new AuditLogInterceptor(app.get(Reflector)),
  );
  app.useGlobalFilters(new GraphQLExceptionFilter());

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Servidor de Tareas ejecutándose en: http://localhost:${port}/graphql`);
}
bootstrap();
