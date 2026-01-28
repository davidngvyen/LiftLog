import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redis, CacheKeys } from '@/lib/redis'
import { enforceRateLimit } from '@/lib/security/ratelimit'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { id: targetUserId } = await params
    const currentUserId = session.user.id

    if (targetUserId === currentUserId) {
      return new NextResponse('Cannot follow yourself', { status: 400 })
    }

    // Rate limiting
    const limited = await enforceRateLimit({ req, category: 'write', userId: currentUserId })
    if (limited) return limited

    // Check if user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    })

    if (!targetUser) {
      return new NextResponse('User not found', { status: 404 })
    }

    // Check if already following
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: targetUserId,
        }
      }
    })

    if (existingFollow) {
      return new NextResponse('Already following', { status: 409 })
    }

    // Create follow
    await prisma.follow.create({
      data: {
        followerId: currentUserId,
        followingId: targetUserId,
      },
    })

    // Invalidate caches
    // 1. Invalidate receiver's followers list
    const followersKey = CacheKeys.followers(targetUserId)

    // 2. Invalidate receiver's profile (follower count)
    const receiverProfileKey = CacheKeys.profile(targetUserId)

    // 3. Invalidate sender's profile (following count)
    const senderProfileKey = CacheKeys.profile(currentUserId)

    await Promise.all([
      redis.del(followersKey),
      redis.del(receiverProfileKey),
      redis.del(senderProfileKey),
    ])

    return new NextResponse('Followed successfully', { status: 200 })
  } catch (error) {
    console.error('Error following user:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { id: targetUserId } = await params
    const currentUserId = session.user.id

    if (targetUserId === currentUserId) {
      return new NextResponse('Cannot unfollow yourself', { status: 400 })
    }

    // Rate limiting
    const limited = await enforceRateLimit({ req, category: 'delete', userId: currentUserId })
    if (limited) return limited

    await prisma.follow.deleteMany({
      where: {
        followerId: currentUserId,
        followingId: targetUserId,
      },
    })

    // Invalidate caches
    const followersKey = CacheKeys.followers(targetUserId)
    const receiverProfileKey = CacheKeys.profile(targetUserId)
    const senderProfileKey = CacheKeys.profile(currentUserId)

    await Promise.all([
      redis.del(followersKey),
      redis.del(receiverProfileKey),
      redis.del(senderProfileKey),
    ])

    return new NextResponse('Unfollowed successfully', { status: 200 })
  } catch (error) {
    console.error('Error unfollowing user:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
