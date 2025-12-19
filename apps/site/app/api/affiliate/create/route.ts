import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createAffiliateSchema = z.object({
  businessName: z.string().optional(),
  taxId: z.string().optional(),
  address: z.object({
    line1: z.string(),
    line2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    postal_code: z.string(),
    country: z.string(),
  }).optional(),
});

export async function POST(req: NextRequest) {
  return withAuth(
    async (req: NextRequest, user) => {
      try {
        // Check if user already has an affiliate account
        const existingAffiliate = await prisma.affiliateAccount.findUnique({
          where: { userId: user.id },
        });

        if (existingAffiliate) {
          return NextResponse.json(
            { error: "Affiliate account already exists" },
            { status: 400 }
          );
        }

        const body = await req.json();
        const { businessName, taxId, address } = createAffiliateSchema.parse(body);

        // Generate unique referral code
        const referralCode = generateReferralCode(user.id);
        const referralUrl = `${process.env.SITE_URL}/pricing?ref=${referralCode}`;

        // Create affiliate account
        const affiliateAccount = await prisma.affiliateAccount.create({
          data: {
            userId: user.id,
            referralCode,
            referralUrl,
            businessName,
            taxId,
            address,
            isVerified: false, // Requires manual verification
          },
        });

        // Update user role to affiliate
        await prisma.user.update({
          where: { id: user.id },
          data: { role: "affiliate" },
        });

        return NextResponse.json({
          affiliateAccount: {
            id: affiliateAccount.id,
            referralCode: affiliateAccount.referralCode,
            referralUrl: affiliateAccount.referralUrl,
            commissionRate: affiliateAccount.commissionRate,
            isVerified: affiliateAccount.isVerified,
          },
        });
      } catch (error) {
        console.error("Error creating affiliate account:", error);
        
        if (error instanceof z.ZodError) {
          return NextResponse.json(
            { error: "Invalid request data", details: error.errors },
            { status: 400 }
          );
        }

        return NextResponse.json(
          { error: "Failed to create affiliate account" },
          { status: 500 }
        );
      }
    },
    { requiredPermission: "manage_own_profile" }
  )(req);
}

function generateReferralCode(userId: string): string {
  // Generate a unique referral code based on user ID and timestamp
  const timestamp = Date.now().toString(36);
  const userHash = userId.slice(-4);
  return `AZR${userHash.toUpperCase()}${timestamp.toUpperCase()}`;
}
