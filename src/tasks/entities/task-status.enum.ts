import { registerEnumType } from '@nestjs/graphql';

/**
 * Estados posibles para una tarea de desarrollo de software.
 */
export enum TaskStatus {
  BACKLOG = 'Backlog',
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done',
}

// Registramos el enum en GraphQL para poder utilizarlo como un tipo en el esquema.
registerEnumType(TaskStatus, {
  name: 'TaskStatus',
  description: 'Los estados disponibles para una tarea',
});
