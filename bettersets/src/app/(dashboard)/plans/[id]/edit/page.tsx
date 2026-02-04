import { auth } from "@/lib/auth"
import PlanWizard from "@/components/plan/PlanWizard"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { getPlanById } from "@/services/workout-plan.service"

export default async function EditPlanPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth()

    if (!session?.user?.id) {
        redirect("/auth/signin")
    }

    const { id } = await params
    const [plan, exercises] = await Promise.all([
        getPlanById(id),
        prisma.exercise.findMany({
            orderBy: { name: 'asc' }
        })
    ])

    if (!plan) {
        notFound()
    }

    if (plan.userId !== session.user.id) {
        redirect("/plans")
    }

    return (
        <div className="container mx-auto py-6 max-w-3xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Edit Plan</h1>
                <p className="text-muted-foreground mt-1">
                    Update your routine details and schedule.
                </p>
            </div>

            <PlanWizard exercises={exercises} initialData={plan} />
        </div>
    )
}
