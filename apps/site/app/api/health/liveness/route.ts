import { NextResponse } from "next/server";

export async function GET() {
  // Simple liveness check - is the app running?
  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}