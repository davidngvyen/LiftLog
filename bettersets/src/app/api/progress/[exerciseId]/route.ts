import { auth } from '@/lib/auth'
import { enforceRateLimit } from '@/lib/security/ratelimit'
import { getExerciseProgress } from '@/services/progress.service'
import { NextResponse } from 'next/server'

export async function GET(
    req: Request,
    { params }: { params: Promise<{ exerciseId: string }> }
) {
    const limited = await enforceRateLimit({ req, category: 'read' })
    if (limited) return limited

    try {
        const session = await auth()
        if (!session?.user?.id) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const { exerciseId } = await params
        const data = await getExerciseProgress(session.user.id, exerciseId)
        return NextResponse.json(data)

    } catch (error) {
        console.error('[PROGRESS_GET]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
