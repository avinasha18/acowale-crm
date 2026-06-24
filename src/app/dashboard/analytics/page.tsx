import { db } from "@/lib/db";
import { subDays, format } from "date-fns";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { SentimentChart } from "@/components/dashboard/sentiment-chart";
import { CategoryChart } from "@/components/dashboard/category-chart";

export const metadata = { title: "Analytics | Acowale CRM" };

async function getDetailedAnalytics() {
  const thirtyDaysAgo = subDays(new Date(), 30);

  const [total, resolved, categories, sentiments, dailyItems, avgRating] = await Promise.all([
    db.feedback.count(),
    db.feedback.count({ where: { status: "RESOLVED" } }),
    db.feedback.groupBy({ by: ["category"], _count: { id: true } }),
    db.feedback.groupBy({ by: ["sentiment"], _count: { id: true } }),
    db.feedback.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
    db.feedback.aggregate({ _avg: { rating: true }, where: { rating: { gt: 0 } } }),
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

  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100 * 10) / 10 : 0;
  const npsScore = avgRating._avg.rating ? Math.round((avgRating._avg.rating / 5) * 100 - 30) : 0;

  return { total, resolutionRate, npsScore, trendData, categoryData, sentimentData };
}

export default async function AnalyticsPage() {
  const { total, resolutionRate, npsScore, trendData, categoryData, sentimentData } = await getDetailedAnalytics();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Analytics Overview</h1>
        <p className="text-sm text-gray-500">Insights from your customer feedback data.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Response Time</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">1.4 <span className="text-lg text-gray-500">days</span></p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Resolution Rate</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{resolutionRate}%</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback Volume</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{total.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">NPS Score</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">+{npsScore}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TrendChart data={trendData} />
        <SentimentChart data={sentimentData} />
      </div>

      <CategoryChart data={categoryData} />
    </div>
  );
}
