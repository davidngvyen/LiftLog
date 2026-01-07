import { Ratelimit } from '@upstash/ratelimit'
import { redis } from '@/lib/redis'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

// Auth: 5 req/15min, Read: 100 req/min, Write: 30 req/min, AI: 5 req/hour
export const authLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '15 m'),
    prefix: 'rl:auth',
})

export const readLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'),
    prefix: 'rl:read',
})

export const writeLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, '1 m'),
    prefix: 'rl:write',
})

export const aiLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 h'),
    prefix: 'rl:ai',
})

export async function checkRateLimit(limiter: Ratelimit) {
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for') ?? '127.0.0.1'

    const session = await auth()
    const userId = session?.user?.id

    // Use userId if available, otherwise fallback to IP
    // For strict auth endpoints (login), we might mostly rely on IP, 
    // but this general logic handles both authenticated and anonymous cases.
    const identifier = userId ?? ip

    const result = await limiter.limit(identifier)

    return { ...result, ip, userId }
}

export function rateLimitExceeded(result: {
    limit: number
    reset: number
    remaining: number
}) {
    const retryAfter = Math.ceil((result.reset - Date.now()) / 1000)
    return NextResponse.json(
        {
            error: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests',
            retryAfter,
            limit: result.limit,
            remaining: 0,
        },
        {
            status: 429,
            headers: {
                'X-RateLimit-Limit': result.limit.toString(),
                'Retry-After': retryAfter.toString(),
            },
        }
    )
}

export function withRateLimit(
    limiter: Ratelimit,
    handler: (req: Request) => Promise<NextResponse>
) {
    return async (req: Request) => {
        const result = await checkRateLimit(limiter)

        if (!result.success) {
            // Log the rate limit violation
            await prisma.rateLimitLog.create({
                data: {
                    ip: result.ip,
                    userId: result.userId,
                    endpoint: new URL(req.url).pathname,
                    blocked: true,
                },
            })

            return rateLimitExceeded(result)
        }

        const response = await handler(req)
        response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
        return response
    }
}
