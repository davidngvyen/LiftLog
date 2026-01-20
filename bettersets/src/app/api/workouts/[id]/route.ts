import { auth } from '@/lib/auth'
import { deleteWorkout, getWorkoutById, updateWorkout } from '@/services/workout.service'
import { UpdateWorkoutInput } from '@/types/workout'
import { NextResponse } from 'next/server'
import { enforceRateLimit } from '@/lib/security/ratelimit'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const limited = await enforceRateLimit({ req, category: 'read' })
  if (limited) return limited

  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { id } = await params
    const workout = await getWorkoutById(id)

    if (!workout) {
      return new NextResponse('Not Found', { status: 404 })
    }

    if (workout.userId !== session.user.id) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    return NextResponse.json(workout)
  } catch (error) {
    console.error('[WORKOUT_GET]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const limited = await enforceRateLimit({ req, category: 'write' })
  if (limited) return limited

  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { id } = await params
    const body = await req.json()

    // Ensure the ID in the body matches the URL or is just ignored in favor of URL.
    // updateWorkout expects { id, ...input }
    const updateData: UpdateWorkoutInput = {
      ...body,
      id,
    }

    const workout = await updateWorkout(session.user.id, updateData)

    return NextResponse.json(workout)
  } catch (error) {
    console.error('[WORKOUT_PUT]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const limited = await enforceRateLimit({ req, category: 'write' })
  if (limited) return limited

  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { id } = await params
    await deleteWorkout(session.user.id, id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[WORKOUT_DELETE]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
