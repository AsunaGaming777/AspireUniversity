import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    throw new Error("Test error from API route - Sentry integration test");
  } catch (error) {
    // Sentry is optional - only capture if available
    try {
      const Sentry = await import("@sentry/nextjs");
      Sentry.captureException(error, {
        tags: { test: true, source: "api" },
        extra: {
          timestamp: new Date().toISOString(),
          path: req.nextUrl.pathname,
        },
      });
    } catch {
      // Sentry not available, skip
    }

    return NextResponse.json({
      message: "Error sent to Sentry successfully",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
