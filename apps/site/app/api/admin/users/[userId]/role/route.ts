import { NextRequest, NextResponse } from "next/server";
import { withAuth, logRoleChange } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
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