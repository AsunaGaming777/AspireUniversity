import { z } from 'zod';

export const RoleSchema = z.enum([
  'student',
  'mentor', 
  'instructor',
  'affiliate',
  'admin',
  'moderator',
  'ambassador',
  'alumni',
  'council',
  'overseer'
]);

export type Role = z.infer<typeof RoleSchema>;

export const ROLE_HIERARCHY: Record<Role, number> = {
  student: 1,
  affiliate: 2,
  alumni: 3,
  ambassador: 4,
  mentor: 5,
  instructor: 6,
  moderator: 7,
  admin: 8,
  council: 9,
  overseer: 10
};

export const PermissionSchema = z.enum([
  'course:read', 'course:write', 'course:delete',
  'lesson:read', 'lesson:write', 'lesson:delete',
  'assignment:read', 'assignment:write', 'assignment:grade', 'assignment:delete',
  'user:read', 'user:write', 'user:delete',
  'admin:read', 'admin:write', 'admin:delete',
  'financial:read', 'financial:write',
  'analytics:read',
  'system:read', 'system:write', 'system:delete',
  'manage_own_profile', 'purchase_courses'
]);

export type Permission = z.infer<typeof PermissionSchema>;

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  student: ['course:read', 'lesson:read', 'assignment:read', 'user:read', 'manage_own_profile', 'purchase_courses'],
  affiliate: ['course:read', 'lesson:read', 'assignment:read', 'user:read', 'analytics:read', 'manage_own_profile', 'purchase_courses'],
  alumni: ['course:read', 'lesson:read', 'assignment:read', 'user:read', 'manage_own_profile'],
  ambassador: ['course:read', 'lesson:read', 'assignment:read', 'user:read', 'analytics:read', 'manage_own_profile'],
  mentor: ['course:read', 'lesson:read', 'lesson:write', 'assignment:read', 'assignment:write', 'assignment:grade', 'user:read', 'user:write', 'analytics:read', 'manage_own_profile'],
  instructor: ['course:read', 'course:write', 'lesson:read', 'lesson:write', 'lesson:delete', 'assignment:read', 'assignment:write', 'assignment:grade', 'assignment:delete', 'user:read', 'user:write', 'analytics:read', 'manage_own_profile'],
  moderator: ['course:read', 'course:write', 'lesson:read', 'lesson:write', 'lesson:delete', 'assignment:read', 'assignment:write', 'assignment:grade', 'assignment:delete', 'user:read', 'user:write', 'user:delete', 'analytics:read', 'system:read', 'manage_own_profile'],
  admin: ['course:read', 'course:write', 'course:delete', 'lesson:read', 'lesson:write', 'lesson:delete', 'assignment:read', 'assignment:write', 'assignment:grade', 'assignment:delete', 'user:read', 'user:write', 'user:delete', 'admin:read', 'admin:write', 'admin:delete', 'financial:read', 'financial:write', 'analytics:read', 'system:read', 'system:write', 'manage_own_profile'],
  council: ['course:read', 'course:write', 'course:delete', 'lesson:read', 'lesson:write', 'lesson:delete', 'assignment:read', 'assignment:write', 'assignment:grade', 'assignment:delete', 'user:read', 'user:write', 'user:delete', 'admin:read', 'admin:write', 'admin:delete', 'financial:read', 'financial:write', 'analytics:read', 'system:read', 'system:write', 'system:delete', 'manage_own_profile'],
  overseer: ['course:read', 'course:write', 'course:delete', 'lesson:read', 'lesson:write', 'lesson:delete', 'assignment:read', 'assignment:write', 'assignment:grade', 'assignment:delete', 'user:read', 'user:write', 'user:delete', 'admin:read', 'admin:write', 'admin:delete', 'financial:read', 'financial:write', 'analytics:read', 'system:read', 'system:write', 'system:delete', 'manage_own_profile']
};

export function hasPermission(userRole: Role, permission: Permission): boolean {
  return (ROLE_PERMISSIONS[userRole] || []).includes(permission);
}

export function hasRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function canAccessResource(userRole: Role, resourceRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[resourceRole];
}

export function getAllRoles(): Role[] {
  return Object.keys(ROLE_HIERARCHY) as Role[];
}

export function getRolePermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

export function isAdminRole(role: Role): boolean {
  return ['admin', 'council', 'overseer'].includes(role);
}

export function isStaffRole(role: Role): boolean {
  return ['mentor', 'instructor', 'moderator', 'admin', 'council', 'overseer'].includes(role);
}

export function isStudentRole(role: Role): boolean {
  return ['student', 'alumni', 'ambassador'].includes(role);
}


