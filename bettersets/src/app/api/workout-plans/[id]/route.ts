import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { updateWorkoutPlan } from '@/services/workout-plan.service'
import { NextResponse } from 'next/server'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const { id } = await params
        const body = await req.json()

        // Basic ownership check before service call (service also checks via where clause)
        // But doing it here allows 404 vs 403 distinction if we want. 
        // Simplicity: let service handle it or simple check.

        const updatedPlan = await updateWorkoutPlan(session.user.id, id, body)

        return NextResponse.json(updatedPlan)
    } catch (error) {
        console.error('[PLAN_UPDATE]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const { id } = await params

        await prisma.workoutPlan.delete({
            where: {
                id,
                userId: session.user.id
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('[PLAN_DELETE]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
