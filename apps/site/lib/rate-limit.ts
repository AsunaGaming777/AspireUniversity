import { NextRequest } from "next/server";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

interface RateLimitOptions {
  interval: number; // in seconds
  maxRequests: number;
}

const RATE_LIMITS: Record<string, RateLimitOptions> = {
  auth: { interval: 300, maxRequests: 5 }, // 5 attempts per 5 minutes
  upload: { interval: 60, maxRequests: 10 }, // 10 uploads per minute
  quiz: { interval: 60, maxRequests: 20 }, // 20 quiz submissions per minute
  api: { interval: 60, maxRequests: 100 }, // 100 API calls per minute
};

export async function rateLimit(
  request: NextRequest,
  type: keyof typeof RATE_LIMITS
): Promise<{ success: boolean; remaining: number; reset: number }> {
  const limit = RATE_LIMITS[type];
  const identifier = getIdentifier(request);
  const key = `ratelimit:${type}:${identifier}`;

  try {
    // Get current count
    const current = await redis.incr(key);
    
    // Set expiry on first request
    if (current === 1) {
      await redis.expire(key, limit.interval);
    }

    // Get TTL
    const ttl = await redis.ttl(key);
    const reset = Date.now() + ttl * 1000;

    if (current > limit.maxRequests) {
      return {
        success: false,
        remaining: 0,
        reset,
      };
    }

    return {
      success: true,
      remaining: limit.maxRequests - current,
      reset,
    };
  } catch (error) {
    console.error("Rate limit error:", error);
    // Fail open - allow request if Redis is down
    return {
      success: true,
      remaining: limit.maxRequests,
      reset: Date.now() + limit.interval * 1000,
    };
  }
}

function getIdentifier(request: NextRequest): string {
  // Use IP address or session ID
  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown";
  const sessionId = request.cookies.get("next-auth.session-token")?.value;
  
  return sessionId || ip;
}

export function withRateLimit(
  handler: (req: NextRequest) => Promise<Response>,
  type: keyof typeof RATE_LIMITS
) {
  return async (req: NextRequest) => {
    const result = await rateLimit(req, type);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: "Too many requests",
          retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(Math.ceil((result.reset - Date.now()) / 1000)),
            "X-RateLimit-Limit": String(RATE_LIMITS[type].maxRequests),
            "X-RateLimit-Remaining": String(result.remaining),
            "X-RateLimit-Reset": String(result.reset),
          },
        }
      );
    }

    const response = await handler(req);
    
    // Add rate limit headers to successful responses
    response.headers.set("X-RateLimit-Limit", String(RATE_LIMITS[type].maxRequests));
    response.headers.set("X-RateLimit-Remaining", String(result.remaining));
    response.headers.set("X-RateLimit-Reset", String(result.reset));

    return response;
  };
}
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

interface RateLimitOptions {
  interval: number; // in seconds
  maxRequests: number;
}

const RATE_LIMITS: Record<string, RateLimitOptions> = {
  auth: { interval: 300, maxRequests: 5 }, // 5 attempts per 5 minutes
  upload: { interval: 60, maxRequests: 10 }, // 10 uploads per minute
  quiz: { interval: 60, maxRequests: 20 }, // 20 quiz submissions per minute
  api: { interval: 60, maxRequests: 100 }, // 100 API calls per minute
};

export async function rateLimit(
  request: NextRequest,
  type: keyof typeof RATE_LIMITS
): Promise<{ success: boolean; remaining: number; reset: number }> {
  const limit = RATE_LIMITS[type];
  const identifier = getIdentifier(request);
  const key = `ratelimit:${type}:${identifier}`;

  try {
    // Get current count
    const current = await redis.incr(key);
    
    // Set expiry on first request
    if (current === 1) {
      await redis.expire(key, limit.interval);
    }

    // Get TTL
    const ttl = await redis.ttl(key);
    const reset = Date.now() + ttl * 1000;

    if (current > limit.maxRequests) {
      return {
        success: false,
        remaining: 0,
        reset,
      };
    }

    return {
      success: true,
      remaining: limit.maxRequests - current,
      reset,
    };
  } catch (error) {
    console.error("Rate limit error:", error);
    // Fail open - allow request if Redis is down
    return {
      success: true,
      remaining: limit.maxRequests,
      reset: Date.now() + limit.interval * 1000,
    };
  }
}

function getIdentifier(request: NextRequest): string {
  // Use IP address or session ID
  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown";
  const sessionId = request.cookies.get("next-auth.session-token")?.value;
  
  return sessionId || ip;
}

export function withRateLimit(
  handler: (req: NextRequest) => Promise<Response>,
  type: keyof typeof RATE_LIMITS
) {
  return async (req: NextRequest) => {
    const result = await rateLimit(req, type);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: "Too many requests",
          retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(Math.ceil((result.reset - Date.now()) / 1000)),
            "X-RateLimit-Limit": String(RATE_LIMITS[type].maxRequests),
            "X-RateLimit-Remaining": String(result.remaining),
            "X-RateLimit-Reset": String(result.reset),
          },
        }
      );
    }

    const response = await handler(req);
    
    // Add rate limit headers to successful responses
    response.headers.set("X-RateLimit-Limit", String(RATE_LIMITS[type].maxRequests));
    response.headers.set("X-RateLimit-Remaining", String(result.remaining));
    response.headers.set("X-RateLimit-Reset", String(result.reset));

    return response;
  };
}


