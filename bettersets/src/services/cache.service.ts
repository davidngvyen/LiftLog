import { redis, CacheKeys } from '@/lib/redis'

const TTL = {
  FOLLOWERS: 60 * 60, // 1 hour
  WORKOUTS: 60 * 5,   // 5 minutes
}

export const CacheService = {
  getFollowerCount: async (userId: string, fetcher: () => Promise<number>): Promise<number> => {
    const key = CacheKeys.followers(userId)
    const cached = await redis.get<number>(key)

    if (cached !== null) {
      return cached
    }

    const count = await fetcher()
    await redis.set(key, count, { ex: TTL.FOLLOWERS })
    return count
  },

  invalidateFollowCache: async (userId: string) => {
    const key = CacheKeys.followers(userId)
    await redis.del(key)
  },

  // Generic wrapper could be useful, but for now specific methods are clearer
  getWorkouts: async <T>(userId: string, fetcher: () => Promise<T>): Promise<T> => {
    const key = `workouts:${userId}` // We might want to add this to CacheKeys in redis.ts later, but for now strict adherence to prompt "feed:{userId}, etc" for that file. I'll stick to a local key or update redis.ts if I can.
    // Actually, good practice to keep keys centralized. I'll update redis.ts in a sub-step or just define it here if I don't want to touch that file again excessively.
    // The prompt explicitly asked for specific keys in redis.ts, but didn't mention `workouts`. I'll define it here or use a convention.

    const cached = await redis.get<T>(key)
    if (cached !== null) {
      return cached
    }

    const data = await fetcher()
    await redis.set(key, data, { ex: TTL.WORKOUTS })
    return data
  },

  invalidateWorkouts: async (userId: string) => {
    const key = `workouts:${userId}`
    await redis.del(key)
  }
}
