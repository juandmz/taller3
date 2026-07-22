import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { FilterTasksInput } from './dto/filter-tasks.input';
import { AuditLog } from '../common/decorators/audit-log.decorator';

/**
 * Resolver de GraphQL para el recurso de Tareas.
 * Define los puntos de entrada para consultas (Queries) y mutaciones (Mutations).
 */
@Resolver(() => Task)
export class TasksResolver {
  constructor(private readonly tasksService: TasksService) {}

  /**
   * Consulta que obtiene la lista completa de tareas.
   * Permite aplicar filtros opcionales por proyecto, usuario asignado o estado.
   * @param filter Filtros de búsqueda.
   * @returns Lista de tareas correspondientes.
   */
  @Query(() => [Task], { name: 'tasks', description: 'Obtiene una lista de tareas filtradas' })
  findAll(
    @Args('filter', { type: () => FilterTasksInput, nullable: true })
    filter?: FilterTasksInput,
  ): Task[] {
    return this.tasksService.findAll(filter);
  }

  /**
   * Consulta que obtiene el detalle de una tarea por su ID.
   * @param id Identificador único de la tarea.
   * @returns La tarea solicitada.
   */
  @Query(() => Task, { name: 'task', description: 'Obtiene una tarea por su ID' })
  findOne(
    @Args('id', { type: () => ID })
    id: string,
  ): Task {
    return this.tasksService.findOne(id);
  }

  /**
   * Mutación que crea una nueva tarea.
   * @param createTaskInput Parámetros de creación de la tarea.
   * @returns La tarea creada.
   */
  @Mutation(() => Task, { name: 'createTask', description: 'Crea una nueva tarea' })
  @AuditLog('CREAR_TAREA')
  createTask(
    @Args('createTaskInput')
    createTaskInput: CreateTaskInput,
  ): Task {
    return this.tasksService.create(createTaskInput);
  }

  /**
   * Mutación que edita los atributos de una tarea existente.
   * Permite reasignar usuarios, cambiar estados y etiquetas.
   * @param updateTaskInput Parámetros de actualización de la tarea.
   * @returns La tarea modificada.
   */
  @Mutation(() => Task, { name: 'updateTask', description: 'Actualiza los atributos de una tarea' })
  @AuditLog('ACTUALIZAR_TAREA')
  updateTask(
    @Args('updateTaskInput')
    updateTaskInput: UpdateTaskInput,
  ): Task {
    return this.tasksService.update(updateTaskInput);
  }

  /**
   * Mutación que elimina una tarea de forma permanente del sistema.
   * @param id Identificador único de la tarea a eliminar.
   * @returns true si se eliminó con éxito.
   */
  @Mutation(() => Boolean, { name: 'removeTask', description: 'Elimina una tarea por su ID' })
  @AuditLog('ELIMINAR_TAREA')
  removeTask(
    @Args('id', { type: () => ID })
    id: string,
  ): boolean {
    return this.tasksService.remove(id);
  }
}

