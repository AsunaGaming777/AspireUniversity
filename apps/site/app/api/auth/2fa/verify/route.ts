import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/rbac";
import { verifyTOTP } from "@/lib/two-factor";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  return withAuth(
    async (req: NextRequest, user) => {
      try {
        const { code } = await req.json();

        if (!code) {
          return NextResponse.json(
            { error: "Verification code is required" },
            { status: 400 }
          );
        }

        const userWithSecret = await prisma.user.findUnique({
          where: { id: user.id },
          select: { twoFactorSecret: true },
        });

        if (!userWithSecret?.twoFactorSecret) {
          return NextResponse.json(
            { error: "No 2FA setup found for this account" },
            { status: 400 }
          );
        }

        const isValid = verifyTOTP(userWithSecret.twoFactorSecret, code);

        if (!isValid) {
          return NextResponse.json(
            { error: "Invalid verification code" },
            { status: 400 }
          );
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { twoFactorEnabled: true },
        });

        return NextResponse.json({
          message: "2FA enabled successfully",
        });
      } catch (error) {
        console.error("Error verifying 2FA:", error);
        return NextResponse.json(
          { error: "Failed to verify 2FA code" },
          { status: 500 }
        );
      }
    },
    { requiredPermission: "manage_own_profile" }
  )(req);
}


