import { Ratelimit, type Duration } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

export type RateLimitCategory = 'auth' | 'read' | 'write' | 'delete' | 'ai'

function hasUpstashEnv(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  )
}

const redis = hasUpstashEnv() ? Redis.fromEnv() : null

const RATE_LIMITS = {
  auth: { ip: { limit: 5, window: '15 m' } },
  read: { ip: { limit: 100, window: '1 m' }, user: { limit: 200, window: '1 m' } },
  write: { ip: { limit: 30, window: '1 m' }, user: { limit: 60, window: '1 m' } },
  delete: { ip: { limit: 10, window: '1 m' }, user: { limit: 20, window: '1 m' } },
  ai: { ip: { limit: 3, window: '1 h' }, user: { limit: 5, window: '1 h' } },
} satisfies Record<
  RateLimitCategory,
  {
    ip: { limit: number; window: Duration }
    user?: { limit: number; window: Duration }
  }
>

const limiters: {
  ip: Record<RateLimitCategory, Ratelimit> | null
  user: Record<RateLimitCategory, Ratelimit | null> | null
} = redis
  ? {
      ip: Object.fromEntries(
        Object.entries(RATE_LIMITS).map(([category, config]) => [
          category,
          new Ratelimit({
            redis,
            limiter: Ratelimit.fixedWindow(config.ip.limit, config.ip.window),
            prefix: `rl:ip:${category}`,
          }),
        ])
      ) as Record<RateLimitCategory, Ratelimit>,
      user: Object.fromEntries(
        Object.entries(RATE_LIMITS).map(([category, config]) => [
          category,
          'user' in config && config.user
            ? new Ratelimit({
                redis,
                limiter: Ratelimit.fixedWindow(
                  config.user.limit,
                  config.user.window
                ),
                prefix: `rl:user:${category}`,
              })
            : null,
        ])
      ) as Record<RateLimitCategory, Ratelimit | null>,
    }
  : { ip: null, user: null }

function getIp(req: Request): string {
  const forwardedFor = req.headers.get('x-forwarded-for')
  if (forwardedFor) return forwardedFor.split(',')[0]?.trim() || 'unknown'

  const realIp = req.headers.get('x-real-ip')
  if (realIp) return realIp.trim()

  return 'unknown'
}

function toUnixSeconds(reset: unknown): number {
  if (reset instanceof Date) return Math.floor(reset.getTime() / 1000)
  if (typeof reset === 'number') {
    // Upstash may return seconds or ms; normalize by assuming ms when large
    return reset > 10_000_000_000 ? Math.floor(reset / 1000) : reset
  }
  return Math.floor(Date.now() / 1000)
}

function rateLimitExceededResponse(result: {
  limit: number
  remaining: number
  reset: unknown
}) {
  const reset = toUnixSeconds(result.reset)
  const retryAfter = Math.max(0, reset - Math.floor(Date.now() / 1000))

  return NextResponse.json(
    {
      error: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please try again later.',
      retryAfter,
      limit: result.limit,
      remaining: result.remaining,
      reset,
    },
    {
      status: 429,
      headers: {
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': String(reset),
        'Retry-After': String(retryAfter),
      },
    }
  )
}

export async function enforceRateLimit(params: {
  req: Request
  category: RateLimitCategory
  userId?: string | null
}): Promise<NextResponse | null> {
  if (!limiters.ip) {
    // Fail-open when Upstash isn't configured (common in local dev).
    // In production, configure UPSTASH_REDIS_REST_URL/TOKEN to enforce limits.
    return null
  }

  const ipKey = getIp(params.req)
  const ipResult = await limiters.ip[params.category].limit(ipKey)

  if (!ipResult.success) {
    return rateLimitExceededResponse(ipResult)
  }

  const userLimiter = limiters.user?.[params.category] ?? null
  if (!userLimiter || !params.userId) return null

  const userResult = await userLimiter.limit(params.userId)
  if (!userResult.success) {
    return rateLimitExceededResponse(userResult)
  }

  return null
}
