import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, IsArray, IsEnum, MinLength } from 'class-validator';
import { TaskStatus } from '../entities/task-status.enum';

/**
 * Datos de entrada para actualizar una tarea existente.
 */
@InputType()
export class UpdateTaskInput {
  /**
   * Identificador único de la tarea a modificar.
   */
  @Field(() => ID)
  @IsNotEmpty({ message: 'El ID de la tarea es requerido.' })
  @IsString()
  id: string;

  /**
   * Nuevo título de la tarea.
   */
  @Field({ nullable: true })
  @IsOptional()
  @MinLength(3, { message: 'El título debe tener al menos 3 caracteres.' })
  @IsString()
  title?: string;

  /**
   * Nueva descripción de la tarea.
   */
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * Nuevo estado de la tarea.
   */
  @Field(() => TaskStatus, { nullable: true })
  @IsOptional()
  @IsEnum(TaskStatus, { message: 'El estado provisto no es válido.' })
  status?: TaskStatus;

  /**
   * Lista actualizada de etiquetas. Reemplazará la lista anterior.
   */
  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray({ message: 'Las etiquetas deben ser un arreglo.' })
  @IsString({ each: true, message: 'Cada etiqueta debe ser una cadena de texto.' })
  tags?: string[];

  /**
   * Identificador del nuevo usuario asignado (o nulo para desasignar).
   */
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  assignedUserId?: string;
}
