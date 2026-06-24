"use client";

interface Stats {
  total: number;
  resolved: number;
  inProgress: number;
  avgRating: number;
}

export function StatsCards({ stats }: { stats: Stats }) {
  const cards = [
    { title: "TOTAL FEEDBACK", value: stats.total.toLocaleString(), change: "+12%", color: "text-emerald-600" },
    { title: "POSITIVE FEEDBACK", value: stats.resolved.toLocaleString(), change: "+8%", color: "text-emerald-600" },
    { title: "CATEGORIES", value: "6", change: "", color: "" },
    { title: "THIS WEEK", value: stats.inProgress.toLocaleString(), change: "+23%", color: "text-emerald-600" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.title} className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{card.title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            {card.change && (
              <span className={`text-xs font-medium ${card.color}`}>{card.change}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
