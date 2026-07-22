import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';

/**
 * Módulo de proyectos. Se encarga de gestionar la provisión
 * del servicio de proyectos para todo el sistema.
 */
@Module({
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
