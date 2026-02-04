import { auth } from "@/lib/auth"
import { getActivePlan, setActivePlan } from "@/services/workout-plan.service"
import { NextResponse } from "next/server"

export async function GET() {
    const session = await auth()
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

    const plan = await getActivePlan(session.user.id)
    return NextResponse.json(plan)
}

export async function POST(req: Request) {
    const session = await auth()
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

    try {
        const { planId } = await req.json()
        await setActivePlan(session.user.id, planId)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error setting active plan:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
