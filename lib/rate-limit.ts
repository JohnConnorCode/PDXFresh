/**
 * Simple in-memory rate limiting
 * For production, use Redis (Upstash) or similar distributed cache
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

function parseWindow(window: string): number {
  const match = window.match(/^(\d+)([smhd])$/);
  if (!match) {
    throw new Error(`Invalid window format: ${window}`);
  }

  const [, amount, unit] = match;
  const seconds = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
  }[unit];

  return parseInt(amount) * (seconds || 60);
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
  limit: number;
}

/**
 * Rate limiting implementation
 * @param identifier - Unique identifier (IP, user ID, etc.)
 * @param limit - Maximum requests allowed
 * @param window - Time window (e.g., '1m', '5s', '1h')
 */
export function rateLimit(
  identifier: string,
  limit: number,
  window: string
): RateLimitResult {
  const key = `ratelimit:${identifier}`;
  const now = Date.now();
  const windowSeconds = parseWindow(window);
  const windowMs = windowSeconds * 1000;

  const entry = store.get(key);

  // No entry or expired entry
  if (!entry || entry.resetAt < now) {
    store.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });

    return {
      success: true,
      remaining: limit - 1,
      reset: now + windowMs,
      limit,
    };
  }

  // Increment count
  entry.count++;

  return {
    success: entry.count <= limit,
    remaining: Math.max(0, limit - entry.count),
    reset: entry.resetAt,
    limit,
  };
}

/**
 * Reset rate limit for identifier
 */
export function resetRateLimit(identifier: string): void {
  const key = `ratelimit:${identifier}`;
  store.delete(key);
}
