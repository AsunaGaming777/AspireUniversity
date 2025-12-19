import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/rbac";
import { generateTwoFactorSecret, generateQRCode } from "@/lib/two-factor";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  return withAuth(
    async (req: NextRequest, user) => {
      try {
        if (user.twoFactorEnabled) {
          return NextResponse.json(
            { error: "2FA is already enabled for this account" },
            { status: 400 }
          );
        }

        const setup = generateTwoFactorSecret(user.email);
        const qrCodeUrl = await generateQRCode(setup.qrCodeUrl);

        await prisma.user.update({
          where: { id: user.id },
          data: {
            twoFactorSecret: setup.secret,
            backupCodes: setup.backupCodes,
          },
        });

        return NextResponse.json({
          secret: setup.secret,
          qrCodeUrl,
          backupCodes: setup.backupCodes,
        });
      } catch (error) {
        console.error("Error setting up 2FA:", error);
        return NextResponse.json(
          { error: "Failed to setup 2FA" },
          { status: 500 }
        );
      }
    },
    { requiredPermission: "manage_own_profile" }
  )(req);
}
