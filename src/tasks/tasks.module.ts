import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksResolver } from './tasks.resolver';
import { UsersModule } from '../users/users.module';
import { ProjectsModule } from '../projects/projects.module';

/**
 * Módulo de tareas. Integra la lógica de negocio de tareas
 * con sus dependencias directas (usuarios y proyectos) y
 * registra el Resolver para su consumo vía GraphQL.
 */
@Module({
  imports: [UsersModule, ProjectsModule],
  providers: [TasksResolver, TasksService],
})
export class TasksModule {}
