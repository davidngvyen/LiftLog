import { auth } from "@/lib/auth"
import { getUserPlans, getActivePlan } from "@/services/workout-plan.service"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"
import { redirect } from "next/navigation"
import PlanList from "@/components/plan/PlanList"

export const metadata = {
    title: "Workout Plans | BetterSets",
    description: "Create and manage your workout routines.",
}

export default async function PlansPage() {
    const session = await auth()

    if (!session?.user?.id) {
        redirect("/auth/signin")
    }

    const [plans, activePlanData] = await Promise.all([
        getUserPlans(session.user.id),
        getActivePlan(session.user.id)
    ])

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Workout Plans</h1>
                    <p className="text-muted-foreground mt-1">
                        Design your training schedule with custom plans.
                    </p>
                </div>
                <Button asChild className="w-full sm:w-auto min-h-[44px]">
                    <Link href="/plans/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Plan
                    </Link>
                </Button>
            </div>

            <div className="border-t pt-6">
                <PlanList plans={plans} activePlanId={activePlanData?.plan.id || null} />
            </div>
        </div>
    )
}
