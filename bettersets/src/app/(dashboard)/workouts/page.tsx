import { auth } from "@/lib/auth"
import { getWorkouts } from "@/services/workout.service"
import WorkoutList from "@/components/workout/WorkoutList"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"
import { redirect } from "next/navigation"

export const metadata = {
  title: "Workouts | BetterSets",
  description: "Manage your workouts and track your progress.",
}

export default async function WorkoutsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const workouts = await getWorkouts(session.user.id)

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workouts</h1>
          <p className="text-muted-foreground mt-1">
            View your workout history and plan upcoming sessions.
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto min-h-[44px]">
          <Link href="/workouts/new">
            <Plus className="mr-2 h-4 w-4" />
            New Workout
          </Link>
        </Button>
      </div>

      <div className="border-t pt-6">
        <WorkoutList workouts={workouts} />
      </div>
    </div>
  )
}
