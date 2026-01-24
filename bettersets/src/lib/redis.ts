import { Redis } from '@upstash/redis'

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    throw new Error('Missing Upstash Redis environment variables')
}

export const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export const CacheKeys = {
    feed: (userId: string) => `feed:${userId}`,
    followers: (userId: string) => `followers:${userId}`,
    profile: (userId: string) => `profile:${userId}`,
}
