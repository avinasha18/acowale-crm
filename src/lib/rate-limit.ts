import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

function createRateLimiter() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }

  return new Ratelimit({
    redis: new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    }),
    limiter: Ratelimit.slidingWindow(5, "60 s"),
    analytics: true,
  });
}

let rateLimiter: Ratelimit | null = null;

export function getRateLimiter() {
  if (!rateLimiter) {
    rateLimiter = createRateLimiter();
  }
  return rateLimiter;
}

export async function checkRateLimit(identifier: string) {
  const limiter = getRateLimiter();
  if (!limiter) return { success: true, remaining: 999 };

  const result = await limiter.limit(identifier);
  return { success: result.success, remaining: result.remaining };
}
