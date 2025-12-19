import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Redis from "ioredis";
import Stripe from "stripe";
import { env } from "@aspire/lib";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const stripe = new Stripe(env.STRIPE_SECRET_KEY!, { apiVersion: "2024-12-18.acacia" });

interface HealthCheck {
  status: "healthy" | "unhealthy";
  timestamp: string;
  checks: {
    database: CheckResult;
    redis: CheckResult;
    stripe: CheckResult;
  };
}

interface CheckResult {
  status: "pass" | "fail";
  responseTime?: number;
  error?: string;
}

async function checkDatabase(): Promise<CheckResult> {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return {
      status: "pass",
      responseTime: Date.now() - start,
    };
  } catch (error) {
    return {
      status: "fail",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function checkRedis(): Promise<CheckResult> {
  const start = Date.now();
  try {
    await redis.ping();
    return {
      status: "pass",
      responseTime: Date.now() - start,
    };
  } catch (error) {
    return {
      status: "fail",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function checkStripe(): Promise<CheckResult> {
  const start = Date.now();
  try {
    // Simple API check - list 1 product to verify connection
    await stripe.products.list({ limit: 1 });
    return {
      status: "pass",
      responseTime: Date.now() - start,
    };
  } catch (error) {
    return {
      status: "fail",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function GET() {
  const [database, redisCheck, stripeCheck] = await Promise.all([
    checkDatabase(),
    checkRedis(),
    checkStripe(),
  ]);

  const allHealthy = 
    database.status === "pass" && 
    redisCheck.status === "pass" && 
    stripeCheck.status === "pass";

  const response: HealthCheck = {
    status: allHealthy ? "healthy" : "unhealthy",
    timestamp: new Date().toISOString(),
    checks: {
      database,
      redis: redisCheck,
      stripe: stripeCheck,
    },
  };

  return NextResponse.json(response, {
    status: allHealthy ? 200 : 503,
  });
}