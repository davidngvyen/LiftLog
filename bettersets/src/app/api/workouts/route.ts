import { auth } from '@/lib/auth'
import { createWorkout, getWorkouts } from '@/services/workout.service'
import { CreateWorkoutInput } from '@/types/workout'
import { NextResponse } from 'next/server'
import { enforceRateLimit } from '@/lib/security/ratelimit'

export async function GET(req: Request) {
  const limited = await enforceRateLimit({ req, category: 'read' })
  if (limited) return limited

  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const workouts = await getWorkouts(session.user.id)
    return NextResponse.json(workouts)
  } catch (error) {
    console.error('[WORKOUTS_GET]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function POST(req: Request) {
  // strict rate limiting for creation
  const limited = await enforceRateLimit({ req, category: 'write' })
  if (limited) return limited

  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const workout = await createWorkout(session.user.id, body as CreateWorkoutInput)

    return NextResponse.json(workout)
  } catch (error) {
    console.error('[WORKOUTS_POST]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
