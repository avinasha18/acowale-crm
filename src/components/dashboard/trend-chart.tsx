"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TrendData {
  date: string;
  count: number;
}

export function TrendChart({ data }: { data: TrendData[] }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-gray-900">Feedback Trend — Last 30 Days</h3>
      <div className="mt-4">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1f2937" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#1f2937" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#1f2937"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorTrend)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
