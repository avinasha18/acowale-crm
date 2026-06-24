# TEACH_US.md

## Structured Logging as Your Day-1 Engineering Investment

Most teams add observability after their first production incident. They bolt on APM tools, scramble to add context, and wish they'd thought about it sooner. There's a simpler practice that pays dividends from commit one: **structured logging**.

### The Problem with console.log

```
console.log("User submitted feedback", userId)
```

This is human-readable but machine-unreadable. When you have 10,000 logs per minute across multiple services, you cannot grep your way to an answer.

### What Structured Logging Looks Like

```json
{"level":"info","ts":"2024-06-15T10:30:00Z","msg":"feedback_submitted","userId":"usr_abc","category":"PRODUCT","sentiment":"positive","duration_ms":45,"requestId":"req_xyz"}
```

Every log entry is a machine-parseable JSON object with consistent fields.

### Why This Matters for a Growing Engineering Team

**Instant debugging.** Filter by `requestId` to trace one user's entire journey across services. No more grepping through walls of text hoping to find related entries.

**Free analytics.** Your logs already contain business events. Query them to answer: "Which category generates the most negative sentiment?" or "What's our p95 API latency?" — no dashboard code needed.

**Alerting on patterns.** "Error rate for feedback_submitted exceeded 5% in the last 5 minutes" — trivial with structured data, impossible with unstructured strings.

**Cost-effective observability.** Grafana Loki, AWS CloudWatch Insights, or even basic ELK — all query structured JSON natively. You get 80% of Datadog's power at 5% of the cost.

### The Practice

1. **Adopt a structured logger from day one.** Pino for Node.js (5x faster than Winston), `slog` for Go, `structlog` for Python.
2. **Every log needs:** level, timestamp, event name, correlation ID.
3. **Never log PII.** Log identifiers, not values. `userId: "usr_123"` not `email: "john@..."`.
4. **Use levels deliberately.** `error` = pages someone. `warn` = investigated daily. `info` = business events. `debug` = off in production.

### The Principle

Observability isn't a tool you install after things break. It's a practice you embed from the first commit. The cheapest monitoring system is one that's already producing queryable, structured data. By the time you need it — and you will — it's already there.
