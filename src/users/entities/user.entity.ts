import { ObjectType, Field, ID } from '@nestjs/graphql';

/**
 * Representa un usuario en el sistema de gestión de tareas.
 */
@ObjectType()
export class User {
  /**
   * Identificador único del usuario.
   */
  @Field(() => ID)
  id: string;

  /**
   * Nombre completo del usuario.
   */
  @Field()
  name: string;

  /**
   * Correo electrónico del usuario.
   */
  @Field()
  email: string;
}
