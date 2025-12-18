import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  return withAuth(
    async (req: NextRequest, user) => {
      try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "50");
        const action = searchParams.get("action");
        const userId = searchParams.get("userId");

        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {};
        if (action) where.action = action;
        if (userId) where.userId = userId;

        // Get audit logs with pagination
        const [auditLogs, total] = await Promise.all([
          prisma.auditLog.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  name: true,
                },
              },
            },
          }),
          prisma.auditLog.count({ where }),
        ]);

        return NextResponse.json({
          auditLogs,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        });
      } catch (error) {
        console.error("Error fetching audit logs:", error);
        return NextResponse.json(
          { error: "Failed to fetch audit logs" },
          { status: 500 }
        );
      }
    },
    { requireAdmin: true }
  )(req);
}


