// Environment configuration
export { env, isDemoMode, isProduction, isDevelopment } from './env';
export type { Env } from './env';

// RBAC system
export {
  RoleSchema,
  PermissionSchema,
  ROLE_HIERARCHY,
  ROLE_PERMISSIONS,
  hasPermission,
  hasRole,
  canAccessResource,
  getAllRoles,
  getRolePermissions,
  isAdminRole,
  isStaffRole,
  isStudentRole
} from './rbac';
export type { Role, Permission } from './rbac';

// Logging
export { 
  logger, 
  logRequest, 
  logError, 
  logAuth, 
  logPayment 
} from './logger';
export type { Logger } from './logger';