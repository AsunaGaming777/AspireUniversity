import React from "react";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";
import { Session } from "next-auth";
import { hasPermission, hasRole, isAdminRole, Role, Permission } from "@aspire/lib";
import { prisma } from "./prisma";
import { logAuth } from "@aspire/lib";
import { AccessDenied } from "@/components/admin/AccessDenied";

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  twoFactorEnabled?: boolean;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = (await auth()) as Session | null;
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!session?.user || !(session.user as any).id) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session.user as any).id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      role: true,
      twoFactorEnabled: true,
    },
  });

  return user;
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error("Authentication required");
  }
  
  return user;
}

export async function requireRole(requiredRole: Role): Promise<AuthUser> {
  const user = await requireAuth();
  
  if (!hasRole(user.role, requiredRole)) {
    throw new Error(`Insufficient permissions. Required role: ${requiredRole}`);
  }
  
  return user;
}

export async function requirePermission(permission: Permission): Promise<AuthUser> {
  const user = await requireAuth();
  
  if (!hasPermission(user.role, permission)) {
    throw new Error(`Insufficient permissions. Required permission: ${permission}`);
  }
  
  return user;
}

export async function requireAdmin(): Promise<AuthUser> {
  const user = await requireAuth();
  
  if (!isAdminRole(user.role)) {
    throw new Error("Admin access required");
  }
  
  return user;
}

export async function logRoleChange(
  userId: string,
  oldRole: Role,
  newRole: Role,
  changedBy: string,
  request: NextRequest
): Promise<void> {
  await logAuth("role_change", userId, {
    oldRole,
    newRole,
    changedBy,
    ipAddress: request.ip || request.headers.get("x-forwarded-for"),
    userAgent: request.headers.get("user-agent"),
  });
}

// Middleware for API routes
export function withAuth(
  handler: (req: NextRequest, user: AuthUser) => Promise<NextResponse>,
  options?: {
    requiredRole?: Role;
    requiredPermission?: Permission;
    requireAdmin?: boolean;
  }
) {
  return async (req: NextRequest) => {
    try {
      let user: AuthUser;

      if (options?.requireAdmin) {
        user = await requireAdmin();
      } else if (options?.requiredRole) {
        user = await requireRole(options.requiredRole);
      } else if (options?.requiredPermission) {
        user = await requirePermission(options.requiredPermission);
      } else {
        user = await requireAuth();
      }

      return await handler(req, user);
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Unauthorized" },
        { status: 401 }
      );
    }
  };
}

// Middleware for server components
export async function withServerAuth(
  component: (user: AuthUser) => Promise<React.ReactElement>,
  options?: {
    requiredRole?: Role;
    requiredPermission?: Permission;
    requireAdmin?: boolean;
    fallback?: React.ReactElement;
  }
): Promise<React.ReactElement> {
  try {
    let user: AuthUser;

    if (options?.requireAdmin) {
      user = await requireAdmin();
    } else if (options?.requiredRole) {
      user = await requireRole(options.requiredRole);
    } else if (options?.requiredPermission) {
      user = await requirePermission(options.requiredPermission);
    } else {
      user = await requireAuth();
    }

    return await component(user);
  } catch (error) {
    if (options?.fallback) {
      return options.fallback;
    }
    
    return React.createElement(AccessDenied, {
      message: error instanceof Error ? error.message : "You don't have permission to access this page."
    });
  }
}

