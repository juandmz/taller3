import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Task } from './entities/task.entity';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { FilterTasksInput } from './dto/filter-tasks.input';
import { UsersService } from '../users/users.service';
import { ProjectsService } from '../projects/projects.service';

/**
 * Servicio para gestionar la lógica de negocio de las tareas de desarrollo.
 * Utiliza almacenamiento en memoria.
 */
@Injectable()
export class TasksService {
  /**
   * Almacenamiento en memoria para las tareas.
   */
  private readonly tasks: Task[] = [];

  constructor(
    private readonly usersService: UsersService,
    private readonly projectsService: ProjectsService,
  ) {
    // Inicializar con algunas tareas semilla para facilitar las pruebas
    this.seedTasks();
  }

  /**
   * Poblado inicial de tareas semilla vinculadas a usuarios y proyectos existentes.
   */
  private seedTasks(): void {
    try {
      const user = this.usersService.findOne('user-1');
      const project = this.projectsService.findOne('project-1');

      this.tasks.push({
        id: 'task-1',
        title: 'Configurar Servidor NestJS',
        description: 'Inicializar el proyecto NestJS e instalar las dependencias básicas.',
        status: this.tasks.length === 0 ? 'In Progress' as any : 'Done' as any, // fallback manual
        tags: ['backend', 'setup'],
        createdAt: new Date('2026-07-22T10:00:00Z'),
        assignedUser: user,
        project: project,
      });

      this.tasks.push({
        id: 'task-2',
        title: 'Diseñar Aspectos (AOP)',
        description: 'Crear interceptores para el logging y formateo de excepciones.',
        status: 'Backlog' as any,
        tags: ['aop', 'architecture'],
        createdAt: new Date('2026-07-22T11:00:00Z'),
        project: project,
      });
    } catch (error) {
      // Ignorar errores durante el seeding si los servicios de semilla fallan
    }
  }

  /**
   * Crea una nueva tarea y la registra en el almacenamiento.
   * @param createTaskInput Parámetros de creación de la tarea.
   * @returns La tarea creada.
   */
  create(createTaskInput: CreateTaskInput): Task {
    const { title, description, status, tags, assignedUserId, projectId } = createTaskInput;

    // Validar y obtener el proyecto asociado
    const project = this.projectsService.findOne(projectId);

    // Validar y obtener el usuario asignado si se provee
    let assignedUser = undefined;
    if (assignedUserId) {
      assignedUser = this.usersService.findOne(assignedUserId);
    }

    const newTask: Task = {
      id: randomUUID(),
      title,
      description,
      status: status || ('Backlog' as any),
      tags: tags || [],
      createdAt: new Date(),
      assignedUser,
      project,
    };

    this.tasks.push(newTask);
    return newTask;
  }

  /**
   * Busca tareas que cumplan con criterios opcionales de filtrado.
   * @param filter Filtros aplicables (proyecto, usuario, estado).
   * @returns Lista de tareas filtradas.
   */
  findAll(filter?: FilterTasksInput): Task[] {
    let result = [...this.tasks];

    if (filter) {
      const { status, projectId, assignedUserId } = filter;

      if (status) {
        result = result.filter((t) => t.status === status);
      }
      if (projectId) {
        result = result.filter((t) => t.project.id === projectId);
      }
      if (assignedUserId) {
        result = result.filter((t) => t.assignedUser?.id === assignedUserId);
      }
    }

    return result;
  }

  /**
   * Obtiene una tarea específica a partir de su ID.
   * @param id Identificador único de la tarea.
   * @returns La tarea encontrada.
   * @throws NotFoundException Si la tarea no existe.
   */
  findOne(id: string): Task {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) {
      throw new NotFoundException(`Tarea con ID ${id} no encontrada.`);
    }
    return task;
  }

  /**
   * Actualiza los datos de una tarea registrada.
   * @param updateTaskInput Parámetros para la actualización.
   * @returns La tarea actualizada.
   * @throws NotFoundException Si la tarea no existe.
   */
  update(updateTaskInput: UpdateTaskInput): Task {
    const { id, title, description, status, tags, assignedUserId } = updateTaskInput;
    const task = this.findOne(id);

    if (title !== undefined) {
      task.title = title;
    }
    if (description !== undefined) {
      task.description = description;
    }
    if (status !== undefined) {
      task.status = status;
    }
    if (tags !== undefined) {
      task.tags = tags;
    }
    if (assignedUserId !== undefined) {
      if (assignedUserId === null || assignedUserId === '') {
        task.assignedUser = undefined;
      } else {
        task.assignedUser = this.usersService.findOne(assignedUserId);
      }
    }

    return task;
  }

  /**
   * Elimina una tarea a partir de su ID.
   * @param id Identificador único de la tarea a eliminar.
   * @returns true si la tarea fue eliminada con éxito.
   * @throws NotFoundException Si la tarea no existe.
   */
  remove(id: string): boolean {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new NotFoundException(`Tarea con ID ${id} no encontrada para eliminar.`);
    }
    this.tasks.splice(index, 1);
    return true;
  }
}
