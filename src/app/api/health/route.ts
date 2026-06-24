import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const startTime = Date.now();

export async function GET() {
  let dbStatus = "disconnected";

  try {
    await db.$queryRaw`SELECT 1`;
    dbStatus = "connected";
  } catch {
    dbStatus = "error";
  }

  const uptime = Math.floor((Date.now() - startTime) / 1000);

  return NextResponse.json({
    status: dbStatus === "connected" ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    database: dbStatus,
    uptime: `${uptime}s`,
    version: process.env.npm_package_version || "1.0.0",
  });
}
