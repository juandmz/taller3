import { ObjectType, Field, ID } from '@nestjs/graphql';
import { TaskStatus } from './task-status.enum';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';

/**
 * Representa una tarea dentro de un proyecto.
 */
@ObjectType()
export class Task {
  /**
   * Identificador único de la tarea (UUID).
   */
  @Field(() => ID)
  id: string;

  /**
   * Título descriptivo de la tarea.
   */
  @Field()
  title: string;

  /**
   * Descripción detallada del trabajo a realizar.
   */
  @Field()
  description: string;

  /**
   * Estado actual del flujo de trabajo de la tarea.
   */
  @Field(() => TaskStatus)
  status: TaskStatus;

  /**
   * Lista dinámica de etiquetas asignadas a la tarea.
   */
  @Field(() => [String])
  tags: string[];

  /**
   * Fecha de creación del registro.
   */
  @Field()
  createdAt: Date;

  /**
   * Usuario asignado como responsable de la tarea.
   */
  @Field(() => User, { nullable: true })
  assignedUser?: User;

  /**
   * Proyecto al que está vinculada la tarea.
   */
  @Field(() => Project)
  project: Project;
}
