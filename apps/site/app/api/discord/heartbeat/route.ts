import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const expectedToken = `Bearer ${process.env.DISCORD_BOT_TOKEN}`;
    if (authHeader !== expectedToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const heartbeatData = await req.json();
    await redis.setex(
      "discord:bot:heartbeat",
      300,
      JSON.stringify({
        ...heartbeatData,
        receivedAt: new Date().toISOString(),
      })
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Discord heartbeat error:", error);
    return NextResponse.json(
      { error: "Failed to record heartbeat" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const heartbeatData = await redis.get("discord:bot:heartbeat");
    if (!heartbeatData) {
      return NextResponse.json(
        {
          status: "offline",
          message: "No heartbeat received in the last 5 minutes",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(JSON.parse(heartbeatData));
  } catch (error) {
    console.error("Discord heartbeat fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch heartbeat" },
      { status: 500 }
    );
  }
}


