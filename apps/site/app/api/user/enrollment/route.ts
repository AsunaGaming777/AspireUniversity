import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  return withAuth(
    async (req: NextRequest, user) => {
      try {
        const enrollment = await prisma.enrollment.findFirst({
          where: {
            userId: user.id,
            status: "active",
          },
          include: {
            payment: {
              select: {
                amount: true,
                plan: true,
                createdAt: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        if (!enrollment) {
          return NextResponse.json({ enrollment: null });
        }

        return NextResponse.json({
          enrollment: {
            id: enrollment.id,
            plan: enrollment.plan,
            status: enrollment.status,
            accessGrantedAt: enrollment.accessGrantedAt,
            modulesUnlocked: enrollment.modulesUnlocked,
            lessonsCompleted: enrollment.lessonsCompleted,
            payment: enrollment.payment,
          },
        });
      } catch (error) {
        console.error("Error fetching enrollment:", error);
        return NextResponse.json(
          { error: "Failed to fetch enrollment" },
          { status: 500 }
        );
      }
    }
  )(req);
}


