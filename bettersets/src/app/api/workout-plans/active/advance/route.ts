import { auth } from "@/lib/auth"
import { advancePlanDay } from "@/services/workout-plan.service"
import { NextResponse } from "next/server"

export async function POST() {
    const session = await auth()
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

    try {
        const result = await advancePlanDay(session.user.id)
        return NextResponse.json(result)
    } catch (error) {
        console.error("Error advancing plan day:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
