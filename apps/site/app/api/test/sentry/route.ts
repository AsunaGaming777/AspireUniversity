import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

export async function GET(req: NextRequest) {
  try {
    // Intentionally throw an error for Sentry testing
    throw new Error("Test error from API route - Sentry integration test");
  } catch (error) {
    // Capture error in Sentry
    Sentry.captureException(error, {
      tags: {
        test: true,
        source: "api",
      },
      extra: {
        timestamp: new Date().toISOString(),
        path: req.nextUrl.pathname,
      },
    });

    return NextResponse.json({
      message: "Error sent to Sentry successfully",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
import * as Sentry from "@sentry/nextjs";

export async function GET(req: NextRequest) {
  try {
    // Intentionally throw an error for Sentry testing
    throw new Error("Test error from API route - Sentry integration test");
  } catch (error) {
    // Capture error in Sentry
    Sentry.captureException(error, {
      tags: {
        test: true,
        source: "api",
      },
      extra: {
        timestamp: new Date().toISOString(),
        path: req.nextUrl.pathname,
      },
    });

    return NextResponse.json({
      message: "Error sent to Sentry successfully",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}


