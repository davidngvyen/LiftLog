import { auth } from "@/lib/auth"
import PlanWizard from "@/components/plan/PlanWizard"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"

export const metadata = {
    title: "New Plan | BetterSets",
    description: "Create a new workout plan.",
}

export default async function NewPlanPage() {
    const session = await auth()

    if (!session?.user?.id) {
        redirect("/auth/signin")
    }

    const exercises = await prisma.exercise.findMany({
        orderBy: { name: 'asc' }
    })

    return (
        <div className="container mx-auto py-6 max-w-3xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Create New Plan</h1>
                <p className="text-muted-foreground mt-1">
                    Define your routine, days, and exercises.
                </p>
            </div>

            <PlanWizard exercises={exercises} />
        </div>
    )
}
