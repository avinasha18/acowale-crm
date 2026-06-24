import { db } from "@/lib/db";
import { subDays, format } from "date-fns";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { CategoryChart } from "@/components/dashboard/category-chart";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { SentimentChart } from "@/components/dashboard/sentiment-chart";

export const metadata = { title: "Dashboard | Acowale CRM" };

async function getAnalytics() {
  const thirtyDaysAgo = subDays(new Date(), 30);

  const [total, resolved, inProgress, avgRating, categories, sentiments, dailyItems] =
    await Promise.all([
      db.feedback.count(),
      db.feedback.count({ where: { status: "RESOLVED" } }),
      db.feedback.count({ where: { status: "IN_PROGRESS" } }),
      db.feedback.aggregate({ _avg: { rating: true }, where: { rating: { gt: 0 } } }),
      db.feedback.groupBy({ by: ["category"], _count: { id: true } }),
      db.feedback.groupBy({ by: ["sentiment"], _count: { id: true } }),
      db.feedback.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: { createdAt: true },
        orderBy: { createdAt: "asc" },
      }),
    ]);

  const trendMap: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    trendMap[format(subDays(new Date(), i), "dd")] = 0;
  }
  for (const item of dailyItems) {
    const key = format(item.createdAt, "dd");
    if (key in trendMap) trendMap[key]++;
  }

  const trendData = Object.entries(trendMap).map(([date, count]) => ({ date, count }));

  const categoryData = categories.map((c: { category: string; _count: { id: number } }) => ({
    name: c.category.replace(/_/g, " "),
    value: c._count.id,
  }));

  const sentimentData = { positive: 0, neutral: 0, negative: 0 };
  for (const s of sentiments) {
    const item = s as { sentiment: string | null; _count: { id: number } };
    if (item.sentiment && item.sentiment in sentimentData) {
      sentimentData[item.sentiment as keyof typeof sentimentData] = item._count.id;
    }
  }

  return {
    stats: {
      total,
      resolved,
      inProgress,
      avgRating: avgRating._avg.rating ? Math.round(avgRating._avg.rating * 10) / 10 : 0,
    },
    categoryData,
    sentimentData,
    trendData,
  };
}

export default async function DashboardPage() {
  const { stats, categoryData, sentimentData, trendData } = await getAnalytics();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Customer Feedback Intelligence</h1>
        <p className="text-sm text-gray-500">Monitor customer sentiment and product feedback in real time.</p>
      </div>

      <StatsCards stats={stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <TrendChart data={trendData} />
        <CategoryChart data={categoryData} />
      </div>

      <SentimentChart data={sentimentData} />
    </div>
  );
}
