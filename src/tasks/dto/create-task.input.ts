import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, IsArray, IsEnum, MinLength } from 'class-validator';
import { TaskStatus } from '../entities/task-status.enum';

/**
 * Datos de entrada requeridos para crear una nueva tarea.
 */
@InputType()
export class CreateTaskInput {
  /**
   * Título de la tarea. Debe tener al menos 3 caracteres.
   */
  @Field()
  @IsNotEmpty({ message: 'El título no puede estar vacío.' })
  @MinLength(3, { message: 'El título debe tener al menos 3 caracteres.' })
  @IsString()
  title: string;

  /**
   * Descripción de la tarea.
   */
  @Field()
  @IsNotEmpty({ message: 'La descripción no puede estar vacía.' })
  @IsString()
  description: string;

  /**
   * Estado inicial de la tarea. Por defecto será 'Backlog'.
   */
  @Field(() => TaskStatus, { nullable: true, defaultValue: TaskStatus.BACKLOG })
  @IsOptional()
  @IsEnum(TaskStatus, { message: 'El estado provisto no es válido.' })
  status?: TaskStatus;

  /**
   * Etiquetas iniciales de la tarea.
   */
  @Field(() => [String], { nullable: true, defaultValue: [] })
  @IsOptional()
  @IsArray({ message: 'Las etiquetas deben ser un arreglo.' })
  @IsString({ each: true, message: 'Cada etiqueta debe ser una cadena de texto.' })
  tags?: string[];

  /**
   * Identificador del usuario asignado.
   */
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  assignedUserId?: string;

  /**
   * Identificador del proyecto al que pertenece la tarea.
   */
  @Field()
  @IsNotEmpty({ message: 'El ID del proyecto es requerido.' })
  @IsString()
  projectId: string;
}
