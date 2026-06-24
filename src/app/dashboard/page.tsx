import { db } from "@/lib/db";
import { subDays, format } from "date-fns";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { CategoryChart } from "@/components/dashboard/category-chart";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { SentimentChart } from "@/components/dashboard/sentiment-chart";
import Link from "next/link";

export const metadata = { title: "Dashboard | Acowale CRM" };

async function getAnalytics() {
  const thirtyDaysAgo = subDays(new Date(), 30);

  const [total, resolved, inProgress, avgRating, categories, sentiments, dailyItems, recentFeedback] =
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
      db.feedback.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, category: true, message: true, sentiment: true, status: true, createdAt: true },
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
    recentFeedback,
  };
}

const statusColors: Record<string, string> = {
  NEW: "bg-blue-50 text-blue-700",
  IN_PROGRESS: "bg-amber-50 text-amber-700",
  RESOLVED: "bg-emerald-50 text-emerald-700",
  CLOSED: "bg-gray-50 text-gray-600",
};

const statusLabels: Record<string, string> = {
  NEW: "Open",
  IN_PROGRESS: "In Review",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

export default async function DashboardPage() {
  const { stats, categoryData, sentimentData, trendData, recentFeedback } = await getAnalytics();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Overview</h1>
          <p className="text-sm text-gray-500">Real-time summary of customer feedback</p>
        </div>
      </div>

      <StatsCards stats={stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <CategoryChart data={categoryData} />
        <TrendChart data={trendData} />
      </div>

      <SentimentChart data={sentimentData} />

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Recent Feedback</h3>
          <Link href="/dashboard/feedback" className="text-xs font-medium text-blue-600 hover:text-blue-700">
            View All Feedback &rarr;
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Feedback</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider hidden sm:table-cell">Category</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider hidden md:table-cell">User</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider hidden md:table-cell">Date</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentFeedback.map((item) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="text-gray-900 truncate block max-w-[300px]">{item.message}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <span className="text-gray-600 text-xs">{item.category.replace(/_/g, " ")}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className="text-gray-600 text-xs">{item.name}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell text-gray-500 text-xs">
                    {format(new Date(item.createdAt), "MMM dd, yyyy")}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[item.status] || "bg-gray-50 text-gray-600"}`}>
                      {statusLabels[item.status] || item.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentFeedback.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-sm text-gray-400">
                    No feedback submitted yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
