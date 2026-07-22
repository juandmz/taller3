import { Injectable, NotFoundException } from '@nestjs/common';
import { Project } from './entities/project.entity';

/**
 * Servicio para gestionar la lógica de negocio de los proyectos.
 * Utiliza un almacenamiento en memoria.
 */
@Injectable()
export class ProjectsService {
  /**
   * Almacenamiento en memoria para los proyectos.
   */
  private readonly projects: Project[] = [
    {
      id: 'project-1',
      name: 'Taller 3 AOP',
      description: 'Implementación del backend con GraphQL y Aspect-Oriented Programming.',
    },
    {
      id: 'project-2',
      name: 'E-commerce React-Nest',
      description: 'Desarrollo de una tienda en línea moderna utilizando React y NestJS.',
    },
  ];

  /**
   * Obtiene todos los proyectos.
   * @returns Lista de proyectos.
   */
  findAll(): Project[] {
    return this.projects;
  }

  /**
   * Busca un proyecto por su identificador único.
   * @param id Identificador único del proyecto.
   * @returns El proyecto encontrado.
   * @throws NotFoundException Si el proyecto no existe.
   */
  findOne(id: string): Project {
    const project = this.projects.find((p) => p.id === id);
    if (!project) {
      throw new NotFoundException(`Proyecto con ID ${id} no encontrado.`);
    }
    return project;
  }
}
