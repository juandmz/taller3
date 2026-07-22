import { SetMetadata } from '@nestjs/common';

/**
 * Clave de metadatos utilizada para identificar los resolvers que requieren auditoría.
 */
export const AUDIT_LOG_KEY = 'audit_log_action';

/**
 * Decorador personalizado para marcar resolvers de mutaciones que deben ser auditados.
 * Permite definir una descripción específica de la acción de negocio.
 * @param action Nombre o descripción de la acción a auditar (ej. 'CREAR_TAREA').
 */
export const AuditLog = (action: string) => SetMetadata(AUDIT_LOG_KEY, action);
