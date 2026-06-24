"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

interface Feedback {
  id: string;
  name: string;
  email: string | null;
  category: string;
  message: string;
  rating: number;
  sentiment: string | null;
  status: string;
  createdAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const sentimentColors: Record<string, string> = {
  positive: "bg-emerald-50 text-emerald-700 border-emerald-200",
  neutral: "bg-gray-50 text-gray-600 border-gray-200",
  negative: "bg-red-50 text-red-700 border-red-200",
};

const sentimentEmojis: Record<string, string> = {
  positive: "😊",
  neutral: "😐",
  negative: "😞",
};

const statusColors: Record<string, string> = {
  NEW: "bg-blue-50 text-blue-700 border-blue-200",
  IN_PROGRESS: "bg-amber-50 text-amber-700 border-amber-200",
  RESOLVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CLOSED: "bg-gray-50 text-gray-600 border-gray-200",
};

const statusLabels: Record<string, string> = {
  NEW: "Open",
  IN_PROGRESS: "In Review",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

export function FeedbackList() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") || "";
  const [data, setData] = useState<Feedback[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 8, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(urlSearch);
  const [category, setCategory] = useState("all");
  const [sentiment, setSentiment] = useState("all");
  const [page, setPage] = useState(1);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setSearch(urlSearch);
    setPage(1);
  }, [urlSearch]);

  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    let cancelled = false;

    (async () => {
      const params = new URLSearchParams({ page: String(page), limit: "8" });
      if (search) params.set("search", search);
      if (category !== "all") params.set("category", category);
      if (sentiment !== "all") params.set("sentiment", sentiment);

      try {
        const res = await fetch(`/api/feedback?${params}`, { signal: controller.signal });
        if (res.ok && !cancelled) {
          const json = await res.json();
          setData(json.data);
          setPagination(json.pagination);
          setLoading(false);
        }
      } catch {
        // aborted
      }
    })();

    return () => { cancelled = true; controller.abort(); };
  }, [page, category, sentiment, search]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">All Feedback</h1>
          <p className="text-sm text-gray-500">{pagination.total.toLocaleString()} entries</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search feedback..."
          className="w-full sm:w-64 h-9"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <div className="flex gap-2">
          <button
            onClick={() => { setSentiment("all"); setPage(1); }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              sentiment === "all" ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}
          >
            All
          </button>
          <button
            onClick={() => { setSentiment("positive"); }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              sentiment === "positive" ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-gray-600 border-gray-200 hover:border-emerald-400"
            }`}
          >
            Positive
          </button>
          <button
            onClick={() => { setSentiment("neutral"); }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              sentiment === "neutral" ? "bg-gray-600 text-white border-gray-600" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}
          >
            Neutral
          </button>
          <button
            onClick={() => { setSentiment("negative"); }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              sentiment === "negative" ? "bg-red-600 text-white border-red-600" : "bg-white text-gray-600 border-gray-200 hover:border-red-400"
            }`}
          >
            Negative
          </button>
        </div>
        <Select value={category} onValueChange={(v) => setCategory(v || "all")}>
          <SelectTrigger className="w-36 h-9">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="PRODUCT">Product</SelectItem>
            <SelectItem value="FEATURE_REQUEST">Feature Request</SelectItem>
            <SelectItem value="UI_UX">UI/UX</SelectItem>
            <SelectItem value="SUPPORT">Support</SelectItem>
            <SelectItem value="BILLING">Billing</SelectItem>
            <SelectItem value="OTHER">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-14 rounded bg-gray-50 animate-pulse" />
            ))}
          </div>
        ) : data.length === 0 ? (
          <p className="text-sm text-gray-500 py-12 text-center">
            No feedback found matching your filters.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Customer</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider hidden lg:table-cell">Feedback Preview</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Sentiment</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider hidden sm:table-cell">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider hidden md:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <span className="font-medium text-gray-900">{item.name}</span>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className="text-gray-600">{item.category.replace(/_/g, " ")}</span>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <span className="text-gray-500 truncate block max-w-[250px]">{item.message}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      {item.sentiment && (
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border ${sentimentColors[item.sentiment]}`}>
                          {sentimentEmojis[item.sentiment]} {item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${statusColors[item.status]}`}>
                        {statusLabels[item.status] || item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell text-gray-500">
                      {format(new Date(item.createdAt), "MMM dd, yyyy")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Showing {(pagination.page - 1) * pagination.limit + 1}-
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
            </p>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={pagination.page <= 1}
                onClick={() => setPage(page - 1)}
              >
                &larr;
              </Button>
              {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={p === pagination.page ? "default" : "outline"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPage(page + 1)}
              >
                &rarr;
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
