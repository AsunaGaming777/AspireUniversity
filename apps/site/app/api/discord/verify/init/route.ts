import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const expectedToken = `Bearer ${process.env.DISCORD_BOT_TOKEN}`;
    if (authHeader !== expectedToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { discordId, discordUsername, verificationCode } = await req.json();

    if (!discordId || !verificationCode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await redis.setex(
      `discord:verify:${verificationCode}`,
      600,
      JSON.stringify({ discordId, discordUsername })
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Discord verification init error:", error);
    return NextResponse.json(
      { error: "Failed to initialize verification" },
      { status: 500 }
    );
  }
}


