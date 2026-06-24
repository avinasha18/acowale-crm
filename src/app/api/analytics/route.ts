import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { subDays, format } from "date-fns";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const thirtyDaysAgo = subDays(new Date(), 30);

    const [
      totalFeedback,
      resolvedCount,
      inProgressCount,
      avgRating,
      categoryDistribution,
      sentimentDistribution,
      recentFeedback,
      dailyCounts,
    ] = await Promise.all([
      db.feedback.count(),
      db.feedback.count({ where: { status: "RESOLVED" } }),
      db.feedback.count({ where: { status: "IN_PROGRESS" } }),
      db.feedback.aggregate({ _avg: { rating: true }, where: { rating: { gt: 0 } } }),
      db.feedback.groupBy({ by: ["category"], _count: { id: true } }),
      db.feedback.groupBy({ by: ["sentiment"], _count: { id: true } }),
      db.feedback.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      db.feedback.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: { createdAt: true },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    const trendMap: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const date = format(subDays(new Date(), i), "yyyy-MM-dd");
      trendMap[date] = 0;
    }
    for (const item of dailyCounts) {
      const date = format(item.createdAt, "yyyy-MM-dd");
      if (trendMap[date] !== undefined) trendMap[date]++;
    }

    const trendData = Object.entries(trendMap).map(([date, count]) => ({ date, count }));

    const categoryData = categoryDistribution.map((item: { category: string; _count: { id: number } }) => ({
      category: item.category,
      count: item._count.id,
      percentage: totalFeedback > 0 ? Math.round((item._count.id / totalFeedback) * 100) : 0,
    }));

    const sentimentData: Record<string, number> = { positive: 0, neutral: 0, negative: 0 };
    for (const item of sentimentDistribution) {
      const s = (item as { sentiment: string | null; _count: { id: number } });
      if (s.sentiment && sentimentData[s.sentiment] !== undefined) {
        sentimentData[s.sentiment] = s._count.id;
      }
    }

    return NextResponse.json({
      totalFeedback,
      resolvedCount,
      inProgressCount,
      averageRating: avgRating._avg.rating ? Math.round(avgRating._avg.rating * 10) / 10 : 0,
      categoryDistribution: categoryData,
      sentimentDistribution: sentimentData,
      trendData,
      recentFeedback,
    });
  } catch (error) {
    logger.error({ error }, "analytics_fetch_error");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
