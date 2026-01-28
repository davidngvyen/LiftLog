import { prisma } from '@/lib/db'
import { redis, CacheKeys } from '@/lib/redis'
import { Workout } from '@prisma/client'

const FEED_CACHE_TTL = 300 // 5 minutes

export type FeedItem = Workout & {
  user: {
    id: string
    name: string | null
    image: string | null
  }
}

export interface FeedResponse {
  items: FeedItem[]
  nextCursor: string | null
}

export const FeedService = {
  getFeed: async (userId: string, limit: number = 10, cursor?: string): Promise<FeedResponse> => {
    const cacheKey = `${CacheKeys.feed(userId)}:${cursor || 'start'}`

    // Try cache first
    try {
      const cached = await redis.get<FeedResponse>(cacheKey)
      if (cached) {
        return cached
      }
    } catch (e) {
      console.warn('Redis error during getFeed:', e)
    }

    // 1. Get IDs of users I follow
    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true }
    })

    const followingIds = following.map(f => f.followingId)

    if (followingIds.length === 0) {
      return { items: [], nextCursor: null }
    }

    // 2. Fetch workouts
    const workouts = await prisma.workout.findMany({
      where: {
        userId: { in: followingIds },
        isCompleted: true // Only show completed workouts
      },
      take: limit + 1, // +1 to check for next page
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: [
        { date: 'desc' },
        { id: 'desc' } // Tie-breaker
      ],
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        exercises: {
          include: {
            exercise: true,
            sets: true
          }
        }
      }
    })

    let nextCursor: string | null = null
    if (workouts.length > limit) {
      const nextItem = workouts.pop()
      nextCursor = nextItem?.id ?? null
    }

    // Type casting because included relations don't match strict base type easily without codegen types
    const response = {
      items: workouts as unknown as FeedItem[],
      nextCursor
    }

    // Cache result
    try {
      await redis.set(cacheKey, response, { ex: FEED_CACHE_TTL })
    } catch (e) {
      console.warn('Redis error during setFeed:', e)
    }

    return response
  }
}
