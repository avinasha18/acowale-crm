"use client";

interface SentimentData {
  positive: number;
  neutral: number;
  negative: number;
}

export function SentimentChart({ data }: { data: SentimentData }) {
  const total = data.positive + data.neutral + data.negative;
  const items = [
    { label: "Positive", value: data.positive, color: "bg-emerald-500" },
    { label: "Neutral", value: data.neutral, color: "bg-gray-400" },
    { label: "Negative", value: data.negative, color: "bg-red-500" },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-gray-900">Sentiment Trend</h3>
      <div className="mt-6 space-y-4">
        {items.map((item) => {
          const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
          return (
            <div key={item.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{item.label}</span>
                <span className="text-gray-500 text-xs">{pct}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.color} transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${item.color}`} />
            {item.label} {total > 0 ? Math.round((item.value / total) * 100) : 0}%
          </div>
        ))}
      </div>
    </div>
  );
}
