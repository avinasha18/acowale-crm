import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { feedbackSchema } from "@/lib/validations";
import { analyzeSentiment } from "@/lib/sentiment";
import { checkRateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "anonymous";
    const { success, remaining } = await checkRateLimit(ip);

    if (!success) {
      logger.warn({ ip }, "rate_limit_exceeded");
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const body = await request.json();
    const parsed = feedbackSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, category, message, rating } = parsed.data;
    const { label, score } = analyzeSentiment(message);

    const feedback = await db.feedback.create({
      data: {
        name,
        email: email || null,
        category,
        message,
        rating: rating || 0,
        sentiment: label,
        sentimentScore: score,
      },
    });

    logger.info({ feedbackId: feedback.id, category, sentiment: label }, "feedback_submitted");

    return NextResponse.json(feedback, {
      status: 201,
      headers: { "X-RateLimit-Remaining": String(remaining) },
    });
  } catch (error) {
    logger.error({ error }, "feedback_submit_error");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const sentiment = searchParams.get("sentiment");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (status) where.status = status;
    if (sentiment) where.sentiment = sentiment;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const [data, total] = await Promise.all([
      db.feedback.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.feedback.count({ where }),
    ]);

    return NextResponse.json({
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error({ error }, "feedback_fetch_error");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
