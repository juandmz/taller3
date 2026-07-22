import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { TaskStatus } from '../entities/task-status.enum';

/**
 * Criterios opcionales para filtrar la búsqueda de tareas.
 */
@InputType()
export class FilterTasksInput {
  /**
   * Filtrar por estado actual de la tarea.
   */
  @Field(() => TaskStatus, { nullable: true })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  /**
   * Filtrar por identificador único del proyecto.
   */
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  projectId?: string;

  /**
   * Filtrar por identificador único del usuario asignado.
   */
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  assignedUserId?: string;
}
