/**
 * Rate limiter.
 *
 * ⚠️  SERVERLESS CAVEAT: This Map-based limiter is per-process.
 * On serverless platforms (Netlify Functions, Vercel) each cold start
 * gets a fresh Map, so limits do not persist across invocations.
 *
 * What this still does:
 *   - Limits bursts within a single warm function instance
 *   - Provides a clear 429 path for clients
 *   - Complements the AI provider's own rate limits (primary protection)
 *
 * For persistent per-IP limiting without paid services, add Upstash Redis
 * (free tier: 10 000 commands/day, no credit card required) and replace
 * the Map below with @upstash/ratelimit. This is a deferred upgrade, not
 * a blocker for launch.
 */

interface Entry {
  count: number;
  resetAt: number;
}

const store = new Map<string, Entry>();

const WINDOW_MS = 60_000; // 1 minute
const MAX_PER_WINDOW = 8; // conservative: keeps well within CF Workers AI free-tier limits

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function checkRateLimit(identifier: string): RateLimitResult {
  const now = Date.now();
  const entry = store.get(identifier);

  if (!entry || now > entry.resetAt) {
    store.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_PER_WINDOW - 1, resetAt: now + WINDOW_MS };
  }

  if (entry.count >= MAX_PER_WINDOW) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { allowed: true, remaining: MAX_PER_WINDOW - entry.count, resetAt: entry.resetAt };
}

// Purge stale entries every 10 minutes to prevent memory growth
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of store.entries()) {
      if (now > value.resetAt) store.delete(key);
    }
  }, 10 * 60_000);
}
