import { auth } from "@/lib/auth"
import { createWorkoutPlan, getUserPlans } from "@/services/workout-plan.service"
import { NextResponse } from "next/server"

export async function GET() {
    const session = await auth()
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

    const plans = await getUserPlans(session.user.id)
    return NextResponse.json(plans)
}

export async function POST(req: Request) {
    const session = await auth()
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

    try {
        const body = await req.json()
        const plan = await createWorkoutPlan(session.user.id, body)
        return NextResponse.json(plan)
    } catch (error) {
        console.error("Error creating plan:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
