import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';

/**
 * Módulo raíz de la aplicación. Se encarga de inicializar la configuración
 * del motor de GraphQL (Apollo) y registrar los módulos de dominio.
 */
@Module({
  imports: [
    // Configuración del módulo de GraphQL usando el enfoque "Code First"
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true, // Permite acceder al Playground de GraphQL (o Apollo Sandbox) en http://localhost:3000/graphql
      sortSchema: true,
    }),
    UsersModule,
    ProjectsModule,
    TasksModule,
  ],
})
export class AppModule {}
