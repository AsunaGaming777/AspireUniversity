import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { stripe, STRIPE_CONFIG, SubscriptionPlan } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/rbac";
import { z } from "zod";

const createSessionSchema = z.object({
  plan: z.enum(["standard", "mastery", "mastermind"]),
  referralCode: z.string().optional(),
});

export async function POST(req: NextRequest) {
  return withAuth(
    async (req: NextRequest, user) => {
      try {
        const body = await req.json();
        const { plan, referralCode } = createSessionSchema.parse(body);

        // Validate plan
        if (!(plan in STRIPE_CONFIG.plans)) {
          return NextResponse.json(
            { error: "Invalid plan" },
            { status: 400 }
          );
        }

        const planConfig = STRIPE_CONFIG.plans[plan as SubscriptionPlan];

        // Check if user already has an active enrollment for this plan
        const existingEnrollment = await prisma.enrollment.findFirst({
          where: {
            userId: user.id,
            plan: plan as SubscriptionPlan,
            status: "active",
          },
        });

        if (existingEnrollment) {
          return NextResponse.json(
            { error: "You already have an active enrollment for this plan" },
            { status: 400 }
          );
        }

        // Handle referral tracking
        let affiliateId: string | undefined;
        if (referralCode) {
          const affiliate = await prisma.affiliateAccount.findUnique({
            where: { referralCode },
          });
          if (affiliate) {
            affiliateId = affiliate.id;
          }
        }

        // Create or get Stripe customer
        let customer;
        try {
          const existingCustomers = await stripe.customers.list({
            email: user.email,
            limit: 1,
          });

          if (existingCustomers.data.length > 0) {
            customer = existingCustomers.data[0];
          } else {
            customer = await stripe.customers.create({
              email: user.email!,
              name: user.name || undefined,
              metadata: {
                userId: user.id,
                role: user.role,
              },
            });
          }
        } catch (error) {
          console.error("Error creating Stripe customer:", error);
          return NextResponse.json(
            { error: "Failed to create customer" },
            { status: 500 }
          );
        }

        // Create checkout session
        const sessionParams: Stripe.Checkout.SessionCreateParams = {
          customer: customer.id,
          payment_method_types: ["card"],
          mode: plan === "mastermind" ? "subscription" : "payment",
          line_items: [
            {
              price_data: {
                currency: planConfig.currency,
                product_data: {
                  name: planConfig.name,
                  description: planConfig.description,
                },
                unit_amount: planConfig.price,
                ...(plan === "mastermind" && { recurring: { interval: "month" } }),
              },
              quantity: 1,
            },
          ],
          success_url: `${STRIPE_CONFIG.successUrl}&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: STRIPE_CONFIG.cancelUrl,
          metadata: {
            userId: user.id,
            plan,
            affiliateId: affiliateId || "",
            referralCode: referralCode || "",
          },
        };

        const session = await stripe.checkout.sessions.create(sessionParams);

        // Create payment record
        await prisma.payment.create({
          data: {
            userId: user.id,
            stripeSessionId: session.id,
            amount: planConfig.price,
            currency: planConfig.currency,
            status: "pending",
            plan: plan as SubscriptionPlan,
            affiliateId,
            metadata: {
              referralCode: referralCode || "",
              checkoutUrl: session.url,
            },
          },
        });

        return NextResponse.json({
          sessionId: session.id,
          url: session.url,
        });
      } catch (error) {
        console.error("Error creating checkout session:", error);
        
        if (error instanceof z.ZodError) {
          return NextResponse.json(
            { error: "Invalid request data", details: error.errors },
            { status: 400 }
          );
        }

        return NextResponse.json(
          { error: "Failed to create checkout session" },
          { status: 500 }
        );
      }
    },
    { requiredPermission: "purchase_courses" }
  )(req);
}
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { stripe, STRIPE_CONFIG, SubscriptionPlan } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/rbac";
import { z } from "zod";

const createSessionSchema = z.object({
  plan: z.enum(["standard", "mastery", "mastermind"]),
  referralCode: z.string().optional(),
});

export async function POST(req: NextRequest) {
  return withAuth(
    async (req: NextRequest, user) => {
      try {
        const body = await req.json();
        const { plan, referralCode } = createSessionSchema.parse(body);

        // Validate plan
        if (!(plan in STRIPE_CONFIG.plans)) {
          return NextResponse.json(
            { error: "Invalid plan" },
            { status: 400 }
          );
        }

        const planConfig = STRIPE_CONFIG.plans[plan as SubscriptionPlan];

        // Check if user already has an active enrollment for this plan
        const existingEnrollment = await prisma.enrollment.findFirst({
          where: {
            userId: user.id,
            plan: plan as SubscriptionPlan,
            status: "active",
          },
        });

        if (existingEnrollment) {
          return NextResponse.json(
            { error: "You already have an active enrollment for this plan" },
            { status: 400 }
          );
        }

        // Handle referral tracking
        let affiliateId: string | undefined;
        if (referralCode) {
          const affiliate = await prisma.affiliateAccount.findUnique({
            where: { referralCode },
          });
          if (affiliate) {
            affiliateId = affiliate.id;
          }
        }

        // Create or get Stripe customer
        let customer;
        try {
          const existingCustomers = await stripe.customers.list({
            email: user.email,
            limit: 1,
          });

          if (existingCustomers.data.length > 0) {
            customer = existingCustomers.data[0];
          } else {
            customer = await stripe.customers.create({
              email: user.email!,
              name: user.name || undefined,
              metadata: {
                userId: user.id,
                role: user.role,
              },
            });
          }
        } catch (error) {
          console.error("Error creating Stripe customer:", error);
          return NextResponse.json(
            { error: "Failed to create customer" },
            { status: 500 }
          );
        }

        // Create checkout session
        const sessionParams: Stripe.Checkout.SessionCreateParams = {
          customer: customer.id,
          payment_method_types: ["card"],
          mode: plan === "mastermind" ? "subscription" : "payment",
          line_items: [
            {
              price_data: {
                currency: planConfig.currency,
                product_data: {
                  name: planConfig.name,
                  description: planConfig.description,
                },
                unit_amount: planConfig.price,
                ...(plan === "mastermind" && { recurring: { interval: "month" } }),
              },
              quantity: 1,
            },
          ],
          success_url: `${STRIPE_CONFIG.successUrl}&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: STRIPE_CONFIG.cancelUrl,
          metadata: {
            userId: user.id,
            plan,
            affiliateId: affiliateId || "",
            referralCode: referralCode || "",
          },
        };

        const session = await stripe.checkout.sessions.create(sessionParams);

        // Create payment record
        await prisma.payment.create({
          data: {
            userId: user.id,
            stripeSessionId: session.id,
            amount: planConfig.price,
            currency: planConfig.currency,
            status: "pending",
            plan: plan as SubscriptionPlan,
            affiliateId,
            metadata: {
              referralCode: referralCode || "",
              checkoutUrl: session.url,
            },
          },
        });

        return NextResponse.json({
          sessionId: session.id,
          url: session.url,
        });
      } catch (error) {
        console.error("Error creating checkout session:", error);
        
        if (error instanceof z.ZodError) {
          return NextResponse.json(
            { error: "Invalid request data", details: error.errors },
            { status: 400 }
          );
        }

        return NextResponse.json(
          { error: "Failed to create checkout session" },
          { status: 500 }
        );
      }
    },
    { requiredPermission: "purchase_courses" }
  )(req);
}


