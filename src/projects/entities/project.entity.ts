import { ObjectType, Field, ID } from '@nestjs/graphql';

/**
 * Representa un proyecto de software al cual pertenecen las tareas.
 */
@ObjectType()
export class Project {
  /**
   * Identificador único del proyecto.
   */
  @Field(() => ID)
  id: string;

  /**
   * Nombre del proyecto.
   */
  @Field()
  name: string;

  /**
   * Descripción detallada del proyecto.
   */
  @Field({ nullable: true })
  description?: string;
}
