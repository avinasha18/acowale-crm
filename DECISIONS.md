# Engineering Decision Log

## 1. Why did you choose this technology stack?

**Next.js 15+ with TypeScript** — full-stack in a single framework. Server Components for the dashboard means data-fetching happens on the server with zero client JS for static parts. API routes eliminate the need for a separate backend service. TypeScript catches an entire class of bugs at compile time rather than runtime.

**Tailwind + shadcn/ui** — shadcn isn't a component library dependency, it's copy-pasted source code I own. This means no black-box updates breaking my UI, tiny bundle size (only ship what I use), and full customization without fighting abstractions.

**Recharts** — lightest popular charting library for React. SSR-compatible, composable API, handles the donut + area + bar charts needed for the dashboard without pulling in D3 directly.

## 2. Why did you choose this database?

**PostgreSQL (via Neon serverless)** — Feedback data has a fixed schema: name, category, message, rating, timestamp. The dashboard requires aggregation queries (GROUP BY category, COUNT by date range, AVG rating). These are native SQL operations that run in milliseconds.

I specifically rejected MongoDB here. There's nothing "unstructured" about feedback data. MongoDB's "schema flexibility" typically means "no validation at the database layer" — that's a liability in production. PostgreSQL gives me ACID compliance (no feedback is ever silently lost), powerful indexing (compound indexes on category + createdAt for the dashboard), and Neon's serverless model means zero cost at rest with instant scale-up.

## 3. Why did you structure your application this way?

Feature-based colocation over layer-based separation. Each route segment owns its page, loading, and error states. The `/api` routes are thin controllers that delegate to services. Shared Zod schemas (`lib/validations.ts`) are used on both client and server to prevent drift between frontend validation and backend enforcement.

The dashboard uses Server Components by default, with `"use client"` only on interactive pieces (charts, forms, filters). This means the initial page load is fast — no client JS needed to render the stats cards or table structure.

## 4. What trade-offs did you make due to time constraints?

- Single-region deployment instead of edge/multi-region
- Used the `sentiment` npm package (AFINN lexicon) instead of a proper ML model for sentiment analysis — adequate for English text, but a production system would need multilingual NLP
- No WebSocket/SSE real-time updates — dashboard requires page refresh
- No email notifications on feedback submission
- Simple string comparison for password auth instead of bcrypt (demo-only, noted as a TODO for production)

## 5. What would you improve if you had one more week?

1. **Real-time dashboard** via Server-Sent Events — feedback appears instantly without refresh
2. **E2E tests** with Playwright covering the full user journey (submit → dashboard → filter)
3. **Export functionality** — CSV/PDF download of filtered feedback
4. **Email notifications** to admins when negative sentiment feedback arrives
5. **Embeddable widget** — a `<script>` tag any website can drop in to collect feedback
6. **Response system** — admins can reply to feedback, users get notified

## 6. What was the most difficult technical challenge you faced?

Designing the analytics endpoint to perform well at scale. The naive approach (fetch all feedback, aggregate in JavaScript) breaks at 100K records — O(n) memory, O(n) time per request.

Solution: database-level aggregation. The `GET /api/analytics` runs parallel Prisma queries that translate to indexed SQL GROUP BY operations. Category distribution, sentiment counts, and trend data are all computed in PostgreSQL, not in the application layer. Combined with indexed columns (category, createdAt, sentiment), this stays under 50ms even at scale.

## 7. Which AI tools did you use?

Claude Code (Anthropic's CLI) for architecture planning, code generation, and reviewing trade-offs. Used it as a pair programmer — discussing decisions before implementation, not just generating code blindly.

## 8. Share one instance where AI helped you.

Rate limiting strategy. My initial plan was a simple per-IP counter reset every 60 seconds. Claude suggested the sliding window algorithm via Upstash Redis, which prevents the "boundary burst" problem. With fixed windows, a user can fire 10 requests by timing them at the boundary between two 60-second windows. Sliding window is fairer and more production-appropriate, and Upstash's SDK makes it trivial to implement.

## 9. Share one instance where you disagreed with AI and why.

AI initially suggested MongoDB for "flexibility with feedback data that might evolve." I strongly disagreed. Our data has a clear fixed schema — there's nothing flexible about it. The dashboard is fundamentally an analytics product requiring GROUP BY, time-series aggregation, and COUNT operations — all native SQL strengths.

MongoDB's "schema flexibility" often means "no validation" — a liability in production when bad data can silently corrupt your analytics. I chose PostgreSQL because the problem is inherently relational, the queries are inherently aggregation-heavy, and the schema is inherently fixed. This decision paid off immediately when building the analytics endpoint.

## 10. What would break first if this application suddenly had 100,000 users?

**Database connections.** Neon's free tier supports ~100 concurrent connections. With 100K users submitting simultaneously, the connection pool exhausts.

**Mitigation path (in order):**
1. Enable Neon's built-in PgBouncer connection pooling
2. Cache the analytics endpoint response in Redis with 60-second TTL (analytics don't need to be real-time)
3. Add database read replicas for the dashboard queries
4. Move feedback submission to an async queue (accept immediately, process in background)

The rate limiter (Upstash Redis) would handle the traffic increase fine — it's designed for this scale.

## 11. What is one thing in this assignment that you would improve, change, or challenge?

The assignment doesn't clarify whether the analytics dashboard should be **real-time or near-real-time**. This distinction matters enormously:

- **Real-time**: Every dashboard load queries the database directly. Simple to build, but O(n) per request at scale.
- **Near-real-time** (60-second staleness): Pre-compute aggregates, cache in Redis, refresh on a cron. O(1) per request, scales to millions of records.

For a v1, I chose real-time with database-level aggregation (fast enough for thousands of records). But I'd push back and ask the product team: "Is 60-second data staleness acceptable?" If yes, the system scales 100x more cheaply, and the dashboard loads in <10ms regardless of dataset size. That architectural question should be answered before building, not after.
