import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/rbac";

export const GET = withAuth(
  async (req: NextRequest, user) => {
    return NextResponse.json({
      message: "Admin access granted!",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  },
  { requireAdmin: true }
);
import { withAuth } from "@/lib/rbac";

export const GET = withAuth(
  async (req: NextRequest, user) => {
    return NextResponse.json({
      message: "Admin access granted!",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  },
  { requireAdmin: true }
);


