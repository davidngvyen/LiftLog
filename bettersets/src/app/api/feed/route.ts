import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { FeedService } from '@/services/feed.service'
import { enforceRateLimit } from '@/lib/security/ratelimit'

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const cursor = searchParams.get('cursor') ?? undefined
    const limit = parseInt(searchParams.get('limit') ?? '10')

    // Rate limiting
    const limited = await enforceRateLimit({ req, category: 'read', userId: session.user.id })
    if (limited) return limited

    const feed = await FeedService.getFeed(session.user.id, limit, cursor)

    return NextResponse.json(feed)
  } catch (error) {
    console.error('Error fetching feed:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
