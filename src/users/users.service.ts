import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';

/**
 * Servicio para gestionar la lógica de negocio de los usuarios.
 * Utiliza un almacenamiento en memoria.
 */
@Injectable()
export class UsersService {
  /**
   * Almacenamiento en memoria para los usuarios.
   */
  private readonly users: User[] = [
    {
      id: 'user-1',
      name: 'Juan Perez',
      email: 'juan.perez@example.com',
    },
    {
      id: 'user-2',
      name: 'Maria Gomez',
      email: 'maria.gomez@example.com',
    },
    {
      id: 'user-3',
      name: 'Carlos Rodriguez',
      email: 'carlos.rodriguez@example.com',
    },
  ];

  /**
   * Obtiene todos los usuarios registrados.
   * @returns Lista de usuarios.
   */
  findAll(): User[] {
    return this.users;
  }

  /**
   * Busca un usuario por su identificador único.
   * @param id Identificador único del usuario.
   * @returns El usuario encontrado.
   * @throws NotFoundException Si el usuario no existe.
   */
  findOne(id: string): User {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }
    return user;
  }
}
