# Acowale CRM Machine Test by Tejassri Avinasha

A production-ready customer feedback platform with AI-powered sentiment analysis, built for the Acowale engineering challenge.

**Live Demo:** [https://acowalecrm.vercel.app](https://acowalecrm.vercel.app)  
**Decision Log:** [DECISIONS.md](./DECISIONS.md)  
**Teaching Document:** [TEACH_US.md](./TEACH_US.md)

---

## Features

- **Public Feedback Form** — clean, responsive form with real-time validation and star ratings
- **AI Sentiment Analysis** — every submission is automatically classified as positive, neutral, or negative
- **Admin Dashboard** — KPI cards, category donut chart, trend area chart, sentiment bar chart
- **Filtering & Search** — filter by category, status, sentiment, or full-text search
- **Authentication** — credential-based login for admin access with JWT sessions
- **Rate Limiting** — sliding window algorithm via Upstash Redis (5 req/min per IP)
- **Dark/Light Theme** — system-aware with manual toggle
- **Mobile Responsive** — works on all screen sizes

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js (App Router) | Full-stack, Server Components, fast dashboard |
| Language | TypeScript | Compile-time safety, shared types |
| Styling | Tailwind CSS + shadcn/ui | Zero-dependency owned components |
| Charts | Recharts | Lightweight, SSR-compatible |
| Database | PostgreSQL (Neon) | Relational data, SQL aggregation, ACID |
| ORM | Prisma | Type-safe queries, migrations |
| Auth | NextAuth.js v5 | OAuth + credentials, session management |
| Rate Limiting | Upstash Redis | Serverless, sliding window |
| Validation | Zod | Shared client/server schemas |
| Logging | Pino | Structured JSON, fast, redaction |
| Testing | Vitest + RTL | Fast, modern test runner |
| CI/CD | GitHub Actions | Lint → Type Check → Test → Deploy |
| Hosting | Vercel + Neon | Serverless, auto-scaling, free tier |

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Local Development

```bash
# Clone the repository
git clone <repo-url>
cd acowale-crm

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and auth secrets

# Push schema to database
npm run db:push

# Seed with demo data
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Admin Credentials (Seeded)

- Email: `admin@acowale.com`
- Password: `admin123`

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/feedback` | Public (rate-limited) | Submit new feedback |
| GET | `/api/feedback` | Admin | Fetch feedback with filters/pagination |
| GET | `/api/analytics` | Admin | Dashboard analytics summary |
| GET | `/api/health` | Public | Health check with DB status |

### Submit Feedback Example

```bash
curl -X POST http://localhost:3000/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "category": "PRODUCT",
    "message": "The dashboard is really intuitive and fast!",
    "rating": 5
  }'
```

---

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Public Form │────▶│  Next.js API │────▶│ PostgreSQL  │
│  (React)     │     │  (Server)    │     │  (Neon)     │
└─────────────┘     └──────┬───────┘     └─────────────┘
                           │
                    ┌──────┴───────┐
                    │   Sentiment  │
                    │   Analysis   │
                    └──────────────┘

┌─────────────┐     ┌──────────────┐
│  Dashboard   │────▶│  Auth Layer  │──── NextAuth.js
│  (Admin)     │     │  (Middleware)│
└─────────────┘     └──────────────┘
```

---

## Deployment

1. Create a [Neon](https://neon.tech) database
2. Create an [Upstash Redis](https://upstash.com) instance (optional, for rate limiting)
3. Deploy to [Vercel](https://vercel.com) — connect your GitHub repo
4. Set environment variables in Vercel dashboard
5. Run `npx prisma db push` against your production database
6. Seed production data: `npm run db:seed`

---

## Production Readiness

- **Environment Variables** — all config externalized, `.env.example` documented
- **Error Handling** — global error boundaries, structured API error responses
- **Validation** — Zod schemas shared between client and server
- **Logging** — Pino structured JSON logs with request correlation
- **Health Check** — `/api/health` pings database, reports uptime
- **Rate Limiting** — sliding window per IP, graceful degradation if Redis unavailable
- **Auth** — session-based with JWT, middleware-protected routes
- **Testing** — unit tests for validation, sentiment, and components
- **CI/CD** — automated lint → typecheck → test → deploy pipeline

---

## My Journey

I started by analyzing the core problem: feedback is relational data that needs analytics queries. This immediately ruled out NoSQL and pointed to PostgreSQL + SQL aggregation.

The dashboard is the product's heart — it needed to be fast. Server Components let me fetch data on the server and stream HTML with no client-side loading states for the initial render.

Adding sentiment analysis was my "one extra thing" — it makes the dashboard genuinely useful. Instead of just counting feedback, you can see trends in user happiness over time. A product team can filter to "show me all negative feedback about billing" and act on it immediately.

I spent most of my time on the feedback submission UX (it needs to feel effortless) and the dashboard data layer (it needs to be fast and correct). The infrastructure pieces (auth, rate limiting, CI/CD) are important but well-solved problems — I leveraged battle-tested libraries rather than reinventing them.
