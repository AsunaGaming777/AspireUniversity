import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { logRoleChange } from "@/lib/rbac";
import { Role } from "@aspire/lib";

export async function PUT(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  return withAuth(
    async (req: NextRequest, adminUser) => {
      try {
        const { role } = await req.json();
        
        if (!Object.values(Role).includes(role)) {
          return NextResponse.json(
            { error: "Invalid role" },
            { status: 400 }
          );
        }

        // Get current user to check old role
        const currentUser = await prisma.user.findUnique({
          where: { id: params.userId },
          select: { role: true, email: true },
        });

        if (!currentUser) {
          return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
          );
        }

        // Update user role
        const updatedUser = await prisma.user.update({
          where: { id: params.userId },
          data: { role },
          select: {
            id: true,
            email: true,
            role: true,
            name: true,
          },
        });

        // Log the role change
        await logRoleChange(
          params.userId,
          currentUser.role as Role,
          role as Role,
          adminUser.id,
          req
        );

        return NextResponse.json({
          message: "Role updated successfully",
          user: updatedUser,
        });
      } catch (error) {
        console.error("Error updating user role:", error);
        return NextResponse.json(
          { error: "Failed to update user role" },
          { status: 500 }
        );
      }
    },
    { requireAdmin: true }
  )(req);
}
import { withAuth } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { logRoleChange } from "@/lib/rbac";
import { Role } from "@aspire/lib";

export async function PUT(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  return withAuth(
    async (req: NextRequest, adminUser) => {
      try {
        const { role } = await req.json();
        
        if (!Object.values(Role).includes(role)) {
          return NextResponse.json(
            { error: "Invalid role" },
            { status: 400 }
          );
        }

        // Get current user to check old role
        const currentUser = await prisma.user.findUnique({
          where: { id: params.userId },
          select: { role: true, email: true },
        });

        if (!currentUser) {
          return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
          );
        }

        // Update user role
        const updatedUser = await prisma.user.update({
          where: { id: params.userId },
          data: { role },
          select: {
            id: true,
            email: true,
            role: true,
            name: true,
          },
        });

        // Log the role change
        await logRoleChange(
          params.userId,
          currentUser.role as Role,
          role as Role,
          adminUser.id,
          req
        );

        return NextResponse.json({
          message: "Role updated successfully",
          user: updatedUser,
        });
      } catch (error) {
        console.error("Error updating user role:", error);
        return NextResponse.json(
          { error: "Failed to update user role" },
          { status: 500 }
        );
      }
    },
    { requireAdmin: true }
  )(req);
}


