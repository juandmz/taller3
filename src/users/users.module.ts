import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

/**
 * Módulo de usuarios. Se encarga de gestionar la provisión
 * del servicio de usuarios para todo el sistema.
 */
@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
